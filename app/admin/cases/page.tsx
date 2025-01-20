import { prisma } from '@/lib/prisma'
import { CasesList } from './components/cases-list'
import { formatDate } from '@/lib/utils'

async function getCases() {
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
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Format dates before sending to client
  return cases.map(case_ => ({
    ...case_,
    createdAt: formatDate(case_.createdAt)
  }))
}

export default async function AdminCasesPage() {
  const cases = await getCases()

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Case Management</h1>
        <div className="text-sm text-gray-500">
          Total Cases: {cases.length}
        </div>
      </div>
      <CasesList initialCases={cases} />
    </div>
  )
} 