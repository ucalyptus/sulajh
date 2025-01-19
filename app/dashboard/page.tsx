import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CaseList } from '@/components/CaseList'

export default async function DashboardPage() {
  const session = await requireAuth(['CLAIMANT', 'RESPONDENT', 'CASE_MANAGER', 'REGISTRAR', 'NEUTRAL'])

  let cases = []
  
  switch (session.user.role) {
    case 'REGISTRAR':
      cases = await prisma.case.findMany({
        where: { 
          OR: [
            { status: 'PENDING_RESPONDENT' },
            { status: 'PENDING_NEUTRAL' }
          ]
        },
        include: {
          claimant: true,
          respondent: true,
          caseManager: true
        }
      })
      break
      
    case 'CASE_MANAGER':
      cases = await prisma.case.findMany({
        where: { 
          caseManagerId: session.user.id
        },
        include: {
          claimant: true,
          respondent: true
        }
      })
      break
      
    case 'NEUTRAL':
      cases = await prisma.case.findMany({
        where: { 
          status: 'NEUTRAL_ASSIGNED',
          // Add neutral ID when implemented
        },
        include: {
          claimant: true,
          respondent: true
        }
      })
      break
      
    case 'CLAIMANT':
      cases = await prisma.case.findMany({
        where: { 
          claimantId: session.user.id
        },
        include: {
          respondent: true,
          caseManager: true
        }
      })
      break
      
    case 'RESPONDENT':
      cases = await prisma.case.findMany({
        where: { 
          respondentId: session.user.id
        },
        include: {
          claimant: true,
          caseManager: true
        }
      })
      break
  }

  return <CaseList cases={cases} userRole={session.user.role} />
} 