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

// Use this email for development
const DEV_EMAIL = 'melker_personal@proton.me' // Your verified email

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { claimantRequest, respondentEmail } = await request.json()

    // Create invitation token
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 365) // Token expires in 1 year

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
      }
    })

    // Send invitation email
    await sendEmail({
      to: respondentEmail,
      subject: 'You have been invited to respond to a case',
      text: `You have been invited to respond to case #${case_.id}. 
      Click here to respond: ${process.env.NEXT_PUBLIC_APP_URL}/auth/signup?token=${token}`
    })

    return NextResponse.json(case_)
  } catch (error) {
    console.error('Error creating case:', error)
    return new NextResponse('Error creating case', { status: 500 })
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