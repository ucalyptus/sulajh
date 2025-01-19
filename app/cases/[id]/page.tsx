import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CasePageContent } from '@/components/CasePageContent'
import { notFound } from 'next/navigation'

export default async function CasePage({ params }: { params: { id: string } }) {
  const session = await requireAuth(['REGISTRAR', 'CASE_MANAGER', 'NEUTRAL', 'CLAIMANT', 'RESPONDENT'])

  const case_ = await prisma.case.findUnique({
    where: { id: params.id },
    include: {
      claimant: true,
      respondent: true,
      caseManager: true,
      neutral: true
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
    <CasePageContent
      case_={case_}
      userRole={session.user.role}
      caseManagers={caseManagers}
      neutrals={neutrals}
    />
  )
} 