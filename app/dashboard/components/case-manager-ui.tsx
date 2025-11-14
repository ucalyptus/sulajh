import { AssignedCasesView } from './assigned-cases-view'

interface Case {
  id: string
  status: string
  claimant: {
    name?: string | null
    email: string
  }
  respondent?: {
    name?: string | null
    email: string
  } | null
  createdAt: string
}

interface CaseManagerUIProps {
  initialCases: Case[]
}

export function CaseManagerUI({ initialCases }: CaseManagerUIProps) {
  return <AssignedCasesView initialCases={initialCases} allowedRole="CASE_MANAGER" />
} 