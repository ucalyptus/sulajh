import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CasePageContent } from '@/components/CasePageContent'
import { notFound } from 'next/navigation'
import { CaseManagerView } from './components/case-manager-view'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NeutralView } from './components/neutral-view'
import { CaseJudgment } from '@/components/case-judgment'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'

async function getCaseDetails(id: string) {
  return prisma.case.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      claimantRequest: true,
      respondentResponse: true,
      finalDecision: true,
      claimantId: true,
      respondentId: true,
      caseManagerId: true,
      neutralId: true,
      claimant: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      respondent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      caseManager: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      neutral: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })
}

export default async function CasePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // First find the case without filtering by claimantId
  const case_ = await prisma.case.findUnique({
    where: {
      id: params.id
    },
    select: {
      id: true,
      claimantRequest: true,
      respondentResponse: true,
      status: true,
      createdAt: true,
      claimantId: true,
      respondentId: true,
      caseManagerId: true,
      neutralId: true,
      finalDecision: true,
      respondent: {
        select: {
          email: true
        }
      },
      caseManager: {
        select: {
          name: true,
          email: true
        }
      },
      neutral: {
        select: {
          name: true,
          email: true
        }
      },
      invitations: {
        where: {
          status: 'PENDING'
        },
        select: {
          email: true
        },
        take: 1
      },
      claimant: {
        select: {
          email: true
        }
      }
    }
  })

  if (!case_) {
    notFound()
  }

  // Check if user has access to this case
  const hasAccess = 
    session.user.role === 'REGISTRAR' ||
    (session.user.role === 'CASE_MANAGER' && case_.caseManagerId === session.user.id) ||
    (session.user.role === 'NEUTRAL' && case_.neutralId === session.user.id) ||
    case_.claimantId === session.user.id ||
    case_.respondentId === session.user.id

  if (!hasAccess) {
    notFound()
  }

  // Show case manager specific view
  if (session?.user.role === 'CASE_MANAGER' && case_.caseManagerId === session.user.id) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Case #{case_.id}</h1>
        <CaseManagerView caseData={case_} />
        {case_.status === 'DECISION_ISSUED' && case_.finalDecision && (
          <div className="mt-6">
            <CaseJudgment judgment={case_.finalDecision} />
          </div>
        )}
      </div>
    )
  }

  // Show neutral specific view
  if (session?.user.role === 'NEUTRAL' && case_.neutralId === session.user.id) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Case #{case_.id}</h1>
        <NeutralView caseData={case_} />
      </div>
    )
  }

  let caseManagers: any[] = []
  let neutrals: any[] = []

  if (session.user.role === 'REGISTRAR') {
    // Fetch available case managers and neutrals
    caseManagers = await prisma.user.findMany({
      where: { role: 'CASE_MANAGER' }
    })
    
    neutrals = await prisma.user.findMany({
      where: { role: 'NEUTRAL' }
    })
  }

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

            <div>
              <h3 className="font-semibold mb-2">Case Information</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Filed On</dt>
                  <dd>{formatDate(case_.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Claimant</dt>
                  <dd>{case_.claimant.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Respondent</dt>
                  <dd>
                    {case_.respondent?.email || 
                      (case_.invitations[0]?.email && 
                        `${case_.invitations[0].email}`
                      ) || 
                      'Not assigned'
                    }
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