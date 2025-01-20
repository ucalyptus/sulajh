import { prisma } from '@/lib/prisma'
import { CaseDetailUI } from './components/case-detail-ui'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

async function getCaseWithDetails(id: string) {
  return prisma.case.findUnique({
    where: { id },
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
}

async function getAvailableUsers() {
  const [caseManagers, neutrals] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'CASE_MANAGER' },
      select: {
        id: true,
        name: true,
        email: true,
      },
    }),
    prisma.user.findMany({
      where: { role: 'NEUTRAL' },
      select: {
        id: true,
        name: true,
        email: true,
      },
    }),
  ])

  return { caseManagers, neutrals }
}

export default async function CaseDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'REGISTRAR') {
    redirect('/auth/signin')
  }

  const [caseData, availableUsers] = await Promise.all([
    getCaseWithDetails(params.id),
    getAvailableUsers(),
  ])

  if (!caseData) {
    return <div className="p-8">Case not found</div>
  }

  return <CaseDetailUI caseData={caseData} availableUsers={availableUsers} />
} 