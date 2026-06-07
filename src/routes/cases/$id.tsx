import { createFileRoute, redirect, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { prisma } from '@/lib/prisma'
import { CaseJudgment } from '@/components/case-judgment'
import { formatDate } from '@/lib/utils'

const getCaseData = createServerFn({ method: 'GET' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/auth/signin' })

    const case_ = await prisma.case.findUnique({
      where: { id: data.id },
      include: {
        claimant: { select: { id: true, name: true, email: true, role: true } },
        respondent: { select: { id: true, name: true, email: true, role: true } },
        caseManager: { select: { id: true, name: true, email: true, role: true } },
        neutral: { select: { id: true, name: true, email: true, role: true } },
        invitations: { where: { status: 'PENDING' }, select: { email: true }, take: 1 },
      },
    })

    if (!case_) throw notFound()

    const hasAccess =
      session.role === 'REGISTRAR' ||
      (session.role === 'CASE_MANAGER' && case_.caseManagerId === session.id) ||
      (session.role === 'NEUTRAL' && case_.neutralId === session.id) ||
      case_.claimantId === session.id ||
      case_.respondentId === session.id

    if (!hasAccess) throw notFound()

    let caseManagers: any[] = []
    let neutrals: any[] = []

    if (session.role === 'REGISTRAR') {
      caseManagers = await prisma.user.findMany({ where: { role: 'CASE_MANAGER' } })
      neutrals = await prisma.user.findMany({ where: { role: 'NEUTRAL' } })
    }

    return { case_, session, caseManagers, neutrals }
  })

export const Route = createFileRoute('/cases/$id')({
  component: CasePage,
  loader: ({ params }) => getCaseData({ data: { id: params.id } }),
  head: ({ loaderData }) => ({
    meta: [{ title: `Case #${loaderData?.case_?.id || ''} | Sulajh` }],
  }),
})

function CasePage() {
  const { case_, session, caseManagers, neutrals } = Route.useLoaderData()

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">Case #{case_.id}</h1>
            <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {case_.status}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Claim Details</h2>
              <p className="whitespace-pre-wrap text-gray-700">
                {case_.claimantRequest || 'No details provided'}
              </p>
            </div>

            {case_.respondentResponse && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Response</h2>
                <p className="whitespace-pre-wrap text-gray-700">
                  {case_.respondentResponse}
                </p>
              </div>
            )}

            {case_.finalDecision && (
              <CaseJudgment judgment={case_.finalDecision} />
            )}

            <div>
              <h3 className="font-semibold mb-2">Case Information</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Claimant</dt>
                  <dd>{case_.claimant.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Respondent</dt>
                  <dd>
                    {case_.respondent?.email ||
                      case_.invitations[0]?.email ||
                      'Not assigned'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Case Officials</h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Case Manager</dt>
                    <dd>{case_.caseManager?.name || 'Not assigned'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Neutral</dt>
                    <dd>{case_.neutral?.name || 'Not assigned'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
