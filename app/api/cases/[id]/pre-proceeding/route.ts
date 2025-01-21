import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail } from '@/lib/email'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { party } = await request.json()

    const case_ = await prisma.case.findUnique({
      where: { id: params.id },
      include: {
        claimant: true,
        respondent: true,
        caseManager: true,
      },
    })

    if (!case_) {
      return new NextResponse('Case not found', { status: 404 })
    }

    if (case_.caseManagerId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Update case status based on which party's call is completed
    let newStatus
    if (party === 'claimant') {
      newStatus = 'PENDING_PREPROCEEDING_RESPONDENT'
    } else if (party === 'respondent') {
      newStatus = 'PENDING_NEUTRAL'
    }

    await prisma.case.update({
      where: { id: params.id },
      data: { status: newStatus },
    })

    // Send email notification
    const emailRecipient = party === 'claimant' ? case_.claimant : case_.respondent
    if (emailRecipient) {
      await sendEmail({
        to: emailRecipient.email,
        subject: `Pre-proceeding call completed for case #${case_.id}`,
        text: `The pre-proceeding call for your case #${case_.id} has been completed.
        
Next steps will be communicated shortly.

Case Manager: ${case_.caseManager?.name || case_.caseManager?.email}`,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating pre-proceeding status:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 