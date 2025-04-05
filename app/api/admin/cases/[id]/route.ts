import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching case details:', params.id) // Debug log
    const session = await getServerSession(authOptions)
    console.log('Session:', session) // Debug log
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })
    console.log('User:', user) // Debug log

    if (!user || user.role !== 'REGISTRAR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const case_ = await prisma.case.findUnique({
      where: { id: params.id },
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
    })
    console.log('Found case:', case_) // Debug log

    if (!case_) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    return NextResponse.json(case_)
  } catch (error) {
    console.error('Error fetching case:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 