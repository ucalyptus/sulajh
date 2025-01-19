export type CaseStatus = 
  | 'initial'
  | 'claimant_submitted'
  | 'registrar_notified'
  | 'case_manager_assigned'
  | 'respondent_submitted'
  | 'neutral_assigned'
  | 'proceedings_completed'

export interface CaseState {
  id: string;
  status: CaseStatus;
  claimantRequest?: string;
  respondentResponse?: string;
  finalDecision?: string;
  neutralAssigned?: boolean;
} 