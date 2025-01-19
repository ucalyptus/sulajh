'use client'

import { User, Case } from '@prisma/client'
import { formatDate } from '@/lib/utils'

type CaseWithParties = Case & {
  claimant: User
  respondent: User | null
  caseManager: User | null
  neutral: User | null
}

interface CaseDetailsProps {
  case_: CaseWithParties
  userRole: string
}

export function CaseDetails({ case_, userRole }: CaseDetailsProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Case #{case_.id}</h1>
        <p className="text-gray-600">Status: {case_.status}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Claimant</h2>
          <p>{case_.claimant.name || case_.claimant.email}</p>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Claim Details</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {case_.claimantRequest}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Respondent</h2>
          {case_.respondent ? (
            <>
              <p>{case_.respondent.name || case_.respondent.email}</p>
              {case_.respondentResponse && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Response</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {case_.respondentResponse}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">Pending respondent</p>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <h2 className="text-lg font-semibold mb-3">Case Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Case Manager</h3>
            {case_.caseManager ? (
              <p>{case_.caseManager.name || case_.caseManager.email}</p>
            ) : (
              <p className="text-gray-500">Not yet assigned</p>
            )}
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Neutral</h3>
            {case_.neutral ? (
              <p>{case_.neutral.name || case_.neutral.email}</p>
            ) : (
              <p className="text-gray-500">Not yet assigned</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t text-sm text-gray-500">
        <p>Created: {formatDate(case_.createdAt)}</p>
        <p>Last Updated: {formatDate(case_.updatedAt)}</p>
      </div>
    </div>
  )
} 