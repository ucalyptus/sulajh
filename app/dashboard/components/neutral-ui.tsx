'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
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
  createdAt: string
}

interface NeutralUIProps {
  initialCases: Case[]
}

export function NeutralUI({ initialCases }: NeutralUIProps) {
  const { data: session } = useSession()

  if (!session?.user || session.user.role !== 'NEUTRAL') return null

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">My Assigned Cases</h2>
      
      {initialCases.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No cases assigned yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {initialCases.map((case_) => (
            <Link
              key={case_.id}
              href={`/cases/${case_.id}`}
              className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Case #{case_.id}</h3>
                  <Badge className="mt-2">
                    {case_.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(case_.createdAt)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Claimant</p>
                  <p className="text-sm">{case_.claimant.name || case_.claimant.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Respondent</p>
                  <p className="text-sm">
                    {case_.respondent?.name || case_.respondent?.email || 'Not assigned'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 