import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'REGISTRAR') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { caseManagerId, neutralId } = await request.json()

    const updatedCase = await prisma.case.update({
      where: { id: params.id },
      data: {
        caseManagerId,
        neutralId,
        status: caseManagerId ? 'ASSIGNED_TO_MANAGER' : 'PENDING_MANAGER'
      },
      include: {
        caseManager: true,
        neutral: true
      }
    })

    // Send email notifications to assigned parties
    if (updatedCase.caseManager) {
      await resend.emails.send({
        from: 'Dispute Resolution <onboarding@resend.dev>',
        to: process.env.NODE_ENV === 'development' 
          ? process.env.VERIFIED_EMAIL 
          : updatedCase.caseManager.email,
        subject: `New Case Assignment - Case #${updatedCase.id}`,
        html: `You have been assigned as the Case Manager for Case #${updatedCase.id}`
      })
    }

    if (updatedCase.neutral) {
      await resend.emails.send({
        from: 'Dispute Resolution <onboarding@resend.dev>',
        to: process.env.NODE_ENV === 'development' 
          ? process.env.VERIFIED_EMAIL 
          : updatedCase.neutral.email,
        subject: `New Case Assignment - Case #${updatedCase.id}`,
        html: `You have been assigned as the Neutral for Case #${updatedCase.id}`
      })
    }

    return NextResponse.json(updatedCase)
  } catch (error) {
    console.error('Error assigning case:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Error assigning case' }),
      { status: 500 }
    )
  }
} 