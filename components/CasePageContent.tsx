'use client'

import { User, Case } from '@prisma/client'
import { CaseDetails } from '@/components/CaseDetails'
import { CaseAssignment } from '@/components/admin/CaseAssignment'
import { useRouter } from 'next/navigation'

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
    <div className="container mx-auto p-8">
      <CaseDetails case_={case_} userRole={userRole} />
      
      {userRole === 'REGISTRAR' && (
        <div className="mt-8">
          <CaseAssignment
            case_={case_}
            caseManagers={caseManagers}
            neutrals={neutrals}
            onAssign={() => {
              router.refresh()
            }}
          />
        </div>
      )}
    </div>
  )
} 