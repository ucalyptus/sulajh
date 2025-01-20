import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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

export async function GET() {
  try {
    console.log('GET /api/cases called') // Debug log
    const session = await getServerSession(authOptions)
    console.log('Session:', session) // Debug log
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })
    console.log('User:', user) // Debug log

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    let cases = []

    // REGISTRAR can see all cases
    if (user.role === 'REGISTRAR') {
      cases = await prisma.case.findMany({
        include: {
          claimant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          respondent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          caseManager: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          neutral: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      cases = await prisma.case.findMany({
        where: {
          OR: [
            { claimantId: user.id },
            { respondentId: user.id },
            { caseManagerId: user.id },
            { neutralId: user.id },
          ],
        },
        include: {
          claimant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          respondent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          caseManager: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          neutral: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    console.log('Found cases:', cases) // Debug log
    return NextResponse.json(cases)
  } catch (error) {
    console.error('Error fetching cases:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 