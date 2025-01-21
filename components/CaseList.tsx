'use client'

import Link from 'next/link'
import { Case, User, UserRole } from '@prisma/client'

type CaseWithParties = Case & {
  claimant: User
  respondent: User | null
}

interface CaseListProps {
  cases: Case[]
  userRole: UserRole
}

export function CaseList({ cases, userRole }: CaseListProps) {
  return (
    <div className="space-y-6">
      {cases.map((case_) => (
        <div 
          key={case_.id} 
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">
                Case #{case_.id}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Status: {case_.status}
              </p>
            </div>
            <Link
              href={`/cases/${case_.id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
      
      {cases.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No cases found
        </p>
      )}
    </div>
  )
} 