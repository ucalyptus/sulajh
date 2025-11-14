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

interface NeutralUIProps {
  initialCases: Case[]
}

export function NeutralUI({ initialCases }: NeutralUIProps) {
  return <AssignedCasesView initialCases={initialCases} allowedRole="NEUTRAL" />
} 