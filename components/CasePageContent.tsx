'use client'

import { User, Case } from '@prisma/client'
import { CaseDetails } from '@/components/CaseDetails'
import { CaseAssignment } from '@/components/admin/CaseAssignment'
import { useRouter } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'
import { spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  container: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: spacing[8],
  },
  assignmentWrapper: {
    marginTop: spacing[8],
  },
})

type CaseWithParties = Case & {
  claimant: User
  respondent: User | null
  caseManager: User | null
  neutral: User | null
}

interface CasePageContentProps {
  case_: CaseWithParties
  userRole: string
  caseManagers: User[]
  neutrals: User[]
}

export function CasePageContent({ 
  case_, 
  userRole, 
  caseManagers, 
  neutrals 
}: CasePageContentProps) {
  const router = useRouter()

  return (
    <div {...stylex.props(styles.container)}>
      <CaseDetails case_={case_} userRole={userRole} />
      
      {userRole === 'REGISTRAR' && (
        <div {...stylex.props(styles.assignmentWrapper)}>
          <CaseAssignment
            case_={case_}
            caseManagers={caseManagers}
            neutrals={neutrals}
            onAssign={() => {
              router.invalidate()
            }}
          />
        </div>
      )}
    </div>
  )
}
