import { AssignedCasesView } from './assigned-cases-view'
import { AssignedCaseView } from '@/app/types'

interface CaseManagerUIProps {
  initialCases: AssignedCaseView[]
}

export function CaseManagerUI({ initialCases }: CaseManagerUIProps) {
  return <AssignedCasesView initialCases={initialCases} allowedRole="CASE_MANAGER" />
} 