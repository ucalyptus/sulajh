import { Case, User, CaseInvitation, UserRole } from '@prisma/client'

// User types
export type UserWithoutPassword = Omit<User, 'password'>

export type UserBasicInfo = Pick<User, 'id' | 'name' | 'email' | 'role'>

// Case types with relations
export type CaseWithClaimant = Case & {
  claimant: UserBasicInfo
}

export type CaseWithRespondent = Case & {
  respondent: UserBasicInfo | null
}

export type CaseWithRelations = Case & {
  claimant: UserBasicInfo
  respondent: UserBasicInfo | null
  caseManager: UserBasicInfo | null
  neutral: UserBasicInfo | null
}

export type CaseWithAllRelations = Case & {
  claimant: UserWithoutPassword
  respondent: UserWithoutPassword | null
  caseManager: UserWithoutPassword | null
  neutral: UserWithoutPassword | null
  invitations: CaseInvitation[]
}

// Dashboard specific types
export interface DashboardCase {
  id: string
  status: string
  claimantRequest: string | null
  submissionDate: Date
  claimant: UserBasicInfo
  respondent: UserBasicInfo | null
  caseManager: UserBasicInfo | null
  neutral: UserBasicInfo | null
}

// Form types
export interface NewCaseFormData {
  claimantRequest: string
  claimantPhone?: string
  claimantAddress?: string
  preferredContact?: string
  accountNumber?: string
  incidentDate?: Date
  incidentLocation?: string
  disputeAmount?: number
  disputeCategory?: string
  desiredResolution?: string
  evidenceNotes?: string
  priorContact: boolean
  priorContactDates?: string
  priorMethods?: string
  priorResults?: string
  truthStatement: boolean
  signature: string
}

export interface RespondentResponseFormData {
  respondentResponse: string
  respondentPhone?: string
  respondentAddress?: string
  relationship?: string
}

// API Response types
export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CaseListResponse {
  cases: CaseWithRelations[]
  total: number
}

export interface UserListResponse {
  users: UserWithoutPassword[]
  total: number
}

// Session types (for NextAuth)
export interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  role: UserRole
}

// Legacy types (deprecated, keep for backwards compatibility)
export type CaseStatus =
  | 'initial'
  | 'claimant_submitted'
  | 'registrar_notified'
  | 'case_manager_assigned'
  | 'respondent_submitted'
  | 'neutral_assigned'
  | 'proceedings_completed'

export interface CaseState {
  id: string
  status: CaseStatus
  claimantRequest?: string
  respondentResponse?: string
  finalDecision?: string
  neutralAssigned?: boolean
} 