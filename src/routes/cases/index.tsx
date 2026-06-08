import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import StatusBadge from '@/components/StatusBadge'
import { formatDate } from '@/lib/utils'

const getUserCases = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session) throw redirect({ to: '/auth/signin' })

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  if (!user) throw redirect({ to: '/auth/signin' })

  if (user.role === 'REGISTRAR') {
    return prisma.case.findMany({
      include: {
        claimant: { select: { email: true } },
        respondent: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  return prisma.case.findMany({
    where: {
      OR: [
        { claimantId: user.id },
        { respondentId: user.id },
        { caseManagerId: user.id },
        { neutralId: user.id },
      ],
    },
    include: {
      claimant: { select: { email: true } },
      respondent: { select: { email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
})

export const Route = createFileRoute('/cases/')({
  component: CasesPage,
  loader: () => getUserCases(),
  head: () => ({ meta: [{ title: 'Cases | Sulajh' }] }),
})

function CasesPage() {
  const cases = Route.useLoaderData()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">All Cases</h1>
      {cases.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No cases found.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {cases.map((case_: any) => (
            <Link key={case_.id} to="/cases/$id" params={{ id: case_.id }} className="block">
              <Card className="p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">
                      {case_.claimantRequest?.substring(0, 100) || 'No details'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {case_.claimant?.email} → {case_.respondent?.email || 'Pending'} · {formatDate(case_.createdAt)}
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
