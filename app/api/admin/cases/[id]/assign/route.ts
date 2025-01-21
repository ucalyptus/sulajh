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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user || user.role !== 'REGISTRAR') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { role, userId } = await request.json()

    const case_ = await prisma.case.findUnique({
      where: { id: params.id },
      include: {
        claimant: true,
        respondent: true,
      },
    })

    if (!case_) {
      return new NextResponse('Case not found', { status: 404 })
    }

    const assignedUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!assignedUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Update case with new assignment
    const updateData = role === 'caseManager'
      ? { caseManagerId: userId, status: 'ASSIGNED_TO_MANAGER' }
      : { neutralId: userId, status: 'NEUTRAL_ASSIGNED' }

    await prisma.case.update({
      where: { id: params.id },
      data: updateData,
    })

    // Send email notification
    await sendEmail({
      to: assignedUser.email,
      subject: `You have been assigned to case #${case_.id}`,
      text: `You have been assigned as ${role === 'caseManager' ? 'Case Manager' : 'Neutral'} to case #${case_.id}.
      
Claimant: ${case_.claimant.name || case_.claimant.email}
Respondent: ${case_.respondent?.name || case_.respondent?.email || 'Not assigned'}

Please log in to the platform to view the case details.`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error assigning user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 