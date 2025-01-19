'use client'

import { useCompletion } from 'ai/react'
import { Button } from '@/components/ui/button'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CaseState } from '@/types'

export function Neutral() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const caseId = searchParams.get('caseId')
  const [caseData, setCaseData] = useState<CaseState | null>(null)
  const [decision, setDecision] = useState('')
  
  const { complete, completion } = useCompletion({
    api: '/api/neutral',
    onFinish: (result) => {
      setDecision(result)
    },
  })

  // In a real app, this would fetch from your database
  useEffect(() => {
    if (caseId) {
      // Simulating case data retrieval
      // In a real app, this would be a fetch call to your API
      const mockCaseData: CaseState = {
        id: caseId,
        status: 'respondent_submitted',
        claimantRequest: localStorage.getItem(`case_${caseId}_claim`) || '',
        respondentResponse: localStorage.getItem(`case_${caseId}_response`) || '',
        neutralAssigned: true
      }
      setCaseData(mockCaseData)
    }
  }, [caseId])

  const handleConductProceedings = async () => {
    if (!caseId || !caseData) return
    
    await complete(JSON.stringify(caseData))
    // Here you would typically update the case in a database
    console.log('Proceedings completed for case:', caseId)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {caseId && caseData ? (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Case Proceedings</h2>
            <p className="mb-2">Case ID: {caseId}</p>
            
            <div className="mb-4 p-4 border rounded bg-gray-50">
              <h3 className="font-medium mb-2">Claim:</h3>
              <p>{caseData.claimantRequest}</p>
            </div>
            
            <div className="mb-4 p-4 border rounded bg-gray-50">
              <h3 className="font-medium mb-2">Response:</h3>
              <p>{caseData.respondentResponse}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleConductProceedings}
              disabled={!!completion}
            >
              Conduct Proceedings
            </Button>

            {completion && (
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Decision:</h3>
                <div className="whitespace-pre-wrap">{completion}</div>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading case data...</p>
      )}
    </div>
  )
}

