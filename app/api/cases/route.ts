import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateCaseInvitationEmail } from '@/lib/email-templates'
import { Resend } from 'resend'
import { randomUUID } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { sendEmail } from '@/lib/email'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { claimantRequest, respondentEmail } = await request.json()

    if (!claimantRequest?.trim()) {
      return new NextResponse(
        JSON.stringify({ error: 'Claim details are required' }), 
        { status: 400 }
      )
    }

    // Create invitation token
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Token expires in 7 days

    // Create case with connected claimant and invitation
    const case_ = await prisma.case.create({
      data: {
        status: 'PENDING_RESPONDENT',
        claimantRequest,
        claimant: {
          connect: {
            id: session.user.id  // Connect to current user
          }
        },
        invitations: {
          create: {
            email: respondentEmail,
            token,
            expiresAt
          }
        }
      },
      include: {
        claimant: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Generate the invitation URL
    const inviteUrl = `${process.env.NEXTAUTH_URL}/auth/signup?invitation=${token}`

    // Generate email content
    const emailHtml = generateCaseInvitationEmail({
      inviteUrl,
      caseId: case_.id
    })

    // Send invitation email
    try {
      await resend.emails.send({
        from: `Sulajh <${process.env.RESEND_FROM_EMAIL || 'sulajh@resend.ucalyptus.me'}>`,
        to: process.env.NODE_ENV === 'development' ? process.env.VERIFIED_EMAIL! : respondentEmail,
        subject: `Case Response Required - Case #${case_.id}`,
        html: emailHtml,
        replyTo: process.env.SUPPORT_EMAIL
      })

      console.log('Invitation email sent successfully to:', process.env.NODE_ENV === 'development' ? process.env.VERIFIED_EMAIL : respondentEmail)
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError)
      // Don't fail the request if email fails
    }

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