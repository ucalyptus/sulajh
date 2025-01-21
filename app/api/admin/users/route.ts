import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hash } from 'bcryptjs'
import { generatePassword } from '@/lib/utils'
import { generateUserInvitationEmail } from '@/lib/email-templates'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'REGISTRAR') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, email, role } = await request.json()
    console.log('Creating new user:', { name, email, role })

    // Generate a temporary password
    const tempPassword = generatePassword()
    const hashedPassword = await hash(tempPassword, 12)

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    })
    console.log('User created successfully:', user.id)

    // Generate email content
    const emailHtml = generateUserInvitationEmail({
      name,
      email,
      password: tempPassword,
      role
    })

    console.log('Sending invitation email to:', email)

    try {
      // In development, send to verified email
      const toEmail = process.env.NODE_ENV === 'development' 
        ? process.env.VERIFIED_EMAIL // Your verified Resend email
        : email

      const emailResult = await resend.emails.send({
        from: 'Dispute Resolution <onboarding@resend.dev>',
        to: toEmail,
        subject: `Welcome to the Platform - Your ${role} Account`,
        html: emailHtml,
        replyTo: process.env.SUPPORT_EMAIL
      })

      console.log('Email sent successfully:', emailResult)
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Error creating user',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 