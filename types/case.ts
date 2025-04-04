export interface Case {
  id: string
  status: string
  createdAt: string
  claimant?: {
    id: string
    name?: string
    email: string
  }
  respondent?: {
    id: string
    name?: string
    email: string
  }
  caseManager?: {
    id: string
    name?: string
    email: string
  }
  neutral?: {
    id: string
    name?: string
    email: string
  }
} 