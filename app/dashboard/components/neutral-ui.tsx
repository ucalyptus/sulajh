import { AssignedCasesView } from './assigned-cases-view'
import { AssignedCaseView } from '@/app/types'

interface NeutralUIProps {
  initialCases: AssignedCaseView[]
}

export function NeutralUI({ initialCases }: NeutralUIProps) {
  return <AssignedCasesView initialCases={initialCases} allowedRole="NEUTRAL" />
} 