'use client'

import { useRouter } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface Case {
  id: string
  status: string
  claimant: {
    name?: string
    email: string
  }
  respondent?: {
    name?: string
    email: string
  }
  caseManager?: {
    name?: string
    email: string
  }
  createdAt: string
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING_RESPONDENT':
      return 'bg-yellow-100 text-yellow-800'
    case 'ASSIGNED_TO_MANAGER':
      return 'bg-blue-100 text-blue-800'
    case 'IN_PROGRESS':
      return 'bg-green-100 text-green-800'
    case 'CLOSED':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function CasesList({ initialCases }: { initialCases: Case[] }) {
  const router = useRouter()

  return (
    <div className="grid gap-4">
      {initialCases.map((case_) => (
        <div
          key={case_.id}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push(`/admin/cases/${case_.id}`)}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold">Case #{case_.id}</h2>
              <Badge className={`mt-2 ${getStatusColor(case_.status)}`}>
                {case_.status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(case_.createdAt)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Claimant</h3>
              <p className="text-sm">{case_.claimant.name || case_.claimant.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Respondent</h3>
              <p className="text-sm">{case_.respondent?.name || case_.respondent?.email || 'Not assigned'}</p>
            </div>
            {case_.caseManager && (
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Case Manager</h3>
                <p className="text-sm">{case_.caseManager.name || case_.caseManager.email}</p>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-indigo-600 hover:text-indigo-800">
            View Details →
          </div>
        </div>
      ))}
    </div>
  )
} 