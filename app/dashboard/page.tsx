import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardUI } from './components/dashboard-ui'
import { CaseManagerUI } from './components/case-manager-ui'
import { NeutralUI } from './components/neutral-ui'

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
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return <DashboardUI initialCases={cases} />
      
    case 'CASE_MANAGER':
      cases = await prisma.case.findMany({
        where: { 
          caseManagerId: session.user.id,
          NOT: {
            status: 'CLOSED'
          }
        },
        include: {
          claimant: {
            select: {
              name: true,
              email: true
            }
          },
          respondent: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return <CaseManagerUI initialCases={cases} />
      
    case 'NEUTRAL':
      cases = await prisma.case.findMany({
        where: { 
          neutralId: session.user.id,
          NOT: {
            status: 'CLOSED'
          }
        },
        include: {
          claimant: {
            select: {
              name: true,
              email: true
            }
          },
          respondent: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return <NeutralUI initialCases={cases} />
      
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

  return <DashboardUI initialCases={cases} />
} 