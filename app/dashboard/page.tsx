import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/StatusBadge'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

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

  const openCases = cases.filter(c => !['CLOSED', 'DECISION_ISSUED'].includes(c.status))
  const resolvedCases = cases.filter(c => ['CLOSED', 'DECISION_ISSUED'].includes(c.status))

  const getEmptyStateMessage = (role: string) => {
    switch (role) {
      case 'CLAIMANT':
        return "You haven't filed any cases yet. Ready to file your first claim?"
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Welcome + user info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name || 'User'}</h1>
          <p className="text-sm text-muted-foreground">
            {user.email} · <span className="capitalize">{user.role.toLowerCase().replace('_', ' ')}</span> · Member since {formatDate(user.createdAt)}
          </p>
        </div>
        {(user.role === 'CLAIMANT' || user.role === 'REGISTRAR') && (
          <Link href="/cases/new">
            <Button>+ File New Case</Button>
          </Link>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-5">
          <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
          <p className="text-3xl font-bold mt-1">{cases.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-muted-foreground">Open</p>
          <p className="text-3xl font-bold mt-1 text-primary">{openCases.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-muted-foreground">Resolved</p>
          <p className="text-3xl font-bold mt-1 text-emerald-600">{resolvedCases.length}</p>
        </Card>
      </div>

      {/* Cases list */}
      <h2 className="text-lg font-semibold mb-4">Your Cases</h2>
      {cases.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">{getEmptyStateMessage(user.role)}</p>
          {(user.role === 'CLAIMANT' || user.role === 'REGISTRAR') && (
            <Link href="/cases/new">
              <Button variant="outline">File a Claim</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid gap-3">
          {cases.map((case_) => (
            <Link 
              key={case_.id}
              href={`/cases/${case_.id}`}
              className="block"
            >
              <Card className="p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">
                      {case_.claimantRequest 
                        ? case_.claimantRequest.substring(0, 100)
                        : 'No details provided'
                      }
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Respondent: {case_.respondent?.email || 'Pending'} · {formatDate(case_.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={case_.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 