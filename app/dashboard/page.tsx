import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  const cases = await prisma.case.findMany({
    where: {
      claimantId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      claimantRequest: true,
      status: true,
      createdAt: true,
      respondent: {
        select: {
          email: true
        }
      }
    }
  })

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link 
          href="/cases/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          File New Case
        </Link>
      </div>

      {cases.length === 0 ? (
        <p className="text-gray-600">You haven't filed any cases yet.</p>
      ) : (
        <div className="grid gap-4">
          {cases.map((case_) => (
            <Link 
              key={case_.id}
              href={`/cases/${case_.id}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    {case_.claimantRequest 
                      ? `${case_.claimantRequest.substring(0, 100)}...`
                      : 'No details provided'
                    }
                  </h2>
                  <p className="text-sm text-gray-600">
                    Respondent: {case_.respondent?.email || 'Pending'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                    {case_.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatDate(case_.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 