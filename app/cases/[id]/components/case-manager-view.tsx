'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface CaseManagerViewProps {
  caseData: any
}

export function CaseManagerView({ caseData }: CaseManagerViewProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const isDecisionIssued = caseData.status === 'DECISION_ISSUED'

  const markPreProceedingComplete = async (party: 'claimant' | 'respondent') => {
    if (isDecisionIssued) return
    setLoading(true)
    try {
      const response = await fetch(`/api/cases/${caseData.id}/pre-proceeding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ party }),
      })

      if (!response.ok) {
        throw new Error('Failed to update pre-proceeding status')
      }

      toast.success(`Pre-proceeding call completed with ${party}`)
      router.refresh()
    } catch (error) {
      console.error('Error updating pre-proceeding status:', error)
      toast.error('Failed to update pre-proceeding status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Pre-Proceeding Calls</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Claimant Call</h3>
              <p className="text-sm text-gray-500">
                {caseData.claimant.name || caseData.claimant.email}
              </p>
            </div>
            <Button
              onClick={() => markPreProceedingComplete('claimant')}
              disabled={loading || 
                caseData.status !== 'ASSIGNED_TO_MANAGER' ||
                isDecisionIssued}
            >
              {isDecisionIssued ? 'Decision Issued' :
                caseData.status === 'PENDING_PREPROCEEDING_RESPONDENT' ? 
                'Completed' : 'Mark Complete'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Respondent Call</h3>
              <p className="text-sm text-gray-500">
                {caseData.respondent?.name || caseData.respondent?.email || 'Not assigned'}
              </p>
            </div>
            <Button
              onClick={() => markPreProceedingComplete('respondent')}
              disabled={loading || 
                !caseData.respondent || 
                caseData.status === 'ASSIGNED_TO_MANAGER' ||
                caseData.status === 'PENDING_PREPROCEEDING_CLAIMANT' ||
                isDecisionIssued}
            >
              {isDecisionIssued ? 'Decision Issued' :
                caseData.status === 'PENDING_NEUTRAL' ? 
                'Completed' : 'Mark Complete'}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Case Status</h2>
        <Badge>
          {caseData.status.replace(/_/g, ' ')}
        </Badge>
      </div>
    </div>
  )
} 