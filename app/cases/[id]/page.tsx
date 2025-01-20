import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CasePageContent } from '@/components/CasePageContent'
import { notFound } from 'next/navigation'
import { CaseManagerView } from './components/case-manager-view'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NeutralView } from './components/neutral-view'
import { CaseJudgment } from '@/components/case-judgment'

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
  const case_ = await getCaseDetails(params.id)

  if (!case_) {
    return <div>Case not found</div>
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
    <div className="p-8 max-w-4xl mx-auto">
      <CasePageContent
        case_={case_}
        userRole={session.user.role}
        caseManagers={caseManagers}
        neutrals={neutrals}
      />
      {case_.status === 'DECISION_ISSUED' && case_.finalDecision && (
        <div className="mt-6">
          <CaseJudgment judgment={case_.finalDecision} />
        </div>
      )}
    </div>
  )
} 