import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { generatePassword } from '@/lib/utils'
import { Resend } from 'resend'
import { generateUserInvitationEmail } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { response, token } = await request.json()

    // Verify invitation
    const invitation = await prisma.caseInvitation.findFirst({
      where: {
        caseId: params.id,
        token,
        status: 'PENDING',
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!invitation) {
      return new NextResponse('Invalid or expired invitation', { status: 400 })
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: invitation.email }
    })

    let tempPassword: string | null = null

    // Create respondent account and update case in transaction
    const result = await prisma.$transaction(async (tx) => {
      if (!user) {
        // Only create new user if they don't exist
        tempPassword = generatePassword()
        const hashedPassword = await hash(tempPassword, 12)
        
        user = await tx.user.create({
          data: {
            email: invitation.email,
            password: hashedPassword,
            role: 'RESPONDENT'
          }
        })
      }

      // Update case with response and respondent
      const updatedCase = await tx.case.update({
        where: { id: params.id },
        data: {
          respondentId: user.id,
          respondentResponse: response,
          status: 'ASSIGNED_TO_MANAGER'
        }
      })

      // Mark invitation as accepted
      await tx.caseInvitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' }
      })

      return { user, case: updatedCase }
    })

    // Only send credentials email if this is a new user
    if (tempPassword) {
      await resend.emails.send({
        from: 'Dispute Resolution <onboarding@resend.dev>',
        to: process.env.NODE_ENV === 'development' 
          ? process.env.VERIFIED_EMAIL! 
          : invitation.email,
        subject: 'Your Account Details',
        html: generateUserInvitationEmail({
          name: invitation.email,
          email: invitation.email,
          password: tempPassword,
          role: 'RESPONDENT'
        })
      })
    }

    // Send confirmation email
    await resend.emails.send({
      from: 'Dispute Resolution <onboarding@resend.dev>',
      to: process.env.NODE_ENV === 'development' 
        ? process.env.VERIFIED_EMAIL! 
        : invitation.email,
      subject: `Response Submitted - Case #${params.id}`,
      html: `
        <h1>Response Submitted Successfully</h1>
        <p>Your response to Case #${params.id} has been recorded.</p>
        <p>You can view the case details by logging in to your account.</p>
        ${!tempPassword ? `
          <p>Use your existing account credentials to log in.</p>
        ` : ''}
      `
    })

    return NextResponse.json(result.case)
  } catch (error) {
    console.error('Error processing response:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Error processing response' }),
      { status: 500 }
    )
  }
} 