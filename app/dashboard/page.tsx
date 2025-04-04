import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/card'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Fetch user details including createdAt
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  // Update cases query to show all relevant cases based on user role
  const cases = await prisma.case.findMany({
    where: {
      OR: [
        { claimantId: session.user.id },
        { respondentId: session.user.id },
        { caseManagerId: session.user.id },
        { neutralId: session.user.id },
      ],
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

  // Function to get role-specific empty state message
  const getEmptyStateMessage = (role: string) => {
    switch (role) {
      case 'CLAIMANT':
        return "You haven't filed any cases yet."
      case 'RESPONDENT':
        return "You haven't received any cases yet."
      case 'CASE_MANAGER':
        return "You haven't been assigned to any cases yet."
      case 'NEUTRAL':
        return "You haven't received any mediation requests yet."
      default:
        return "No cases found."
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="p-6 mb-8">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Information</h2>
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {user.role}
            </span>
          </div>
          <div className="grid gap-2">
            <p><span className="font-medium">Name:</span> {user.name}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Member since:</span> {formatDate(user.createdAt)}</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* Only show File New Case button for CLAIMANT and REGISTRAR roles */}
        {(user.role === 'CLAIMANT' || user.role === 'REGISTRAR') && (
          <Link 
            href="/cases/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            File New Case
          </Link>
        )}
      </div>

      {cases.length === 0 ? (
        <p className="text-gray-600">{getEmptyStateMessage(user.role)}</p>
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