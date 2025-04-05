import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Fetching admin cases...') // Debug log
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

    const cases = await prisma.case.findMany({
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
    console.log('Found cases:', cases) // Debug log

    return NextResponse.json(cases)
  } catch (error) {
    console.error('Error fetching cases:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
} 