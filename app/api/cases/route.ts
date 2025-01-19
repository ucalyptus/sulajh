import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { generateCaseInvitationEmail } from '@/lib/email-templates'
import { Resend } from 'resend'
import { randomUUID } from 'crypto'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Use this email for development
const DEV_EMAIL = 'melker_personal@proton.me' // Your verified email

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { respondentEmail, claimDetails } = await request.json()

    // Create case and invitation
    const case_ = await prisma.case.create({
      data: {
        status: 'PENDING_RESPONDENT',
        claimantId: session.user.id,
        claimantRequest: claimDetails,
        invitations: {
          create: {
            email: respondentEmail,
            token: randomUUID(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          }
        }
      }
    })

    // Get the created invitation
    const invitation = await prisma.caseInvitation.findFirst({
      where: { caseId: case_.id }
    })

    if (!invitation) {
      throw new Error('Failed to create invitation')
    }

    // Send invitation email
    const inviteUrl = `${process.env.NEXTAUTH_URL}/cases/${case_.id}/respond?token=${invitation.token}`
    
    await resend.emails.send({
      from: 'Dispute Resolution <onboarding@resend.dev>',
      to: process.env.NODE_ENV === 'development' ? process.env.VERIFIED_EMAIL! : respondentEmail,
      subject: `Case Response Required - Case #${case_.id}`,
      html: generateCaseInvitationEmail({ inviteUrl, caseId: case_.id })
    })

    return NextResponse.json(case_)
  } catch (error) {
    console.error('Error creating case:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Error creating case' }),
      { status: 500 }
    )
  }
} 