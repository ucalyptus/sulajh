import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'CASE_MANAGER') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { notes, scheduledDate } = await request.json()

    const updatedCase = await prisma.case.update({
      where: { id: params.id },
      data: {
        preProceeding: {
          create: {
            notes,
            scheduledDate,
            conductedBy: session.user.id
          }
        },
        status: 'PRE_PROCEEDING_SCHEDULED'
      }
    })

    // Send email notifications to parties
    // ... email sending logic ...

    return NextResponse.json(updatedCase)
  } catch (error) {
    console.error('Error scheduling pre-proceeding:', error)
    return new NextResponse('Error scheduling pre-proceeding', { status: 500 })
  }
} 