'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import ReactMarkdown from 'react-markdown'
import { Card } from "@/components/ui/card"
import { CaseJudgment } from "@/components/case-judgment"
import { CaseWithRelations } from '@/app/types'

interface NeutralViewProps {
  caseData: CaseWithRelations
}

export function NeutralView({ caseData }: NeutralViewProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [judgment, setJudgment] = useState(caseData.finalDecision || '')

  const generateJudgment = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/cases/${caseData.id}/judgment`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to generate judgment')
      }

      const newJudgment = await response.text()
      setJudgment(newJudgment)
      toast.success('Judgment generated and saved successfully')
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate judgment'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Case Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-500">Status</h3>
            <Badge className="mt-1">
              {caseData.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <div>
            <h3 className="font-medium text-gray-500">Claimant's Request</h3>
            <p className="mt-1 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
              {caseData.claimantRequest}
            </p>
          </div>
          {caseData.respondentResponse && (
            <div>
              <h3 className="font-medium text-gray-500">Respondent's Response</h3>
              <p className="mt-1 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                {caseData.respondentResponse}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Judgment</h2>
          <Button
            onClick={generateJudgment}
            disabled={loading || !caseData.respondentResponse || caseData.status === 'DECISION_ISSUED'}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? 'Generating...' : 
              caseData.status === 'DECISION_ISSUED' ? 'Decision Issued' : 'Generate Judgment'}
          </Button>
        </div>
        
        {(caseData.status === 'DECISION_ISSUED' || judgment) ? (
          <CaseJudgment judgment={judgment || caseData.finalDecision} />
        ) : (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            <p>Click "Generate Judgment" to analyze the case and provide a decision</p>
            <p className="text-sm mt-2">The AI will consider all evidence and provide a structured decision</p>
          </div>
        )}
      </Card>
    </div>
  )
} 