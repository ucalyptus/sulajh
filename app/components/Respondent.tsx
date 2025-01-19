'use client'

import { useCompletion } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export function Respondent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const caseId = searchParams.get('caseId')
  const [response, setResponse] = useState('')
  const { complete } = useCompletion({ api: '/api/respondent' })

  const handleSubmitResponse = async () => {
    if (!caseId || !response.trim()) return
    
    // Send both the case ID and response text to the AI
    const aiResponse = await complete(JSON.stringify({
      caseId,
      responseText: response
    }))
    
    // Here you would typically update the case in a database
    console.log('Response submitted for case:', caseId, aiResponse)
    // Redirect to neutral page with the case ID
    router.push(`/neutral?caseId=${caseId}`)
    localStorage.setItem(`case_${caseId}_response`, aiResponse)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {caseId ? (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Respond to Case</h2>
            <p className="mb-2">Case ID: {caseId}</p>
            <p className="text-sm text-gray-600 mb-4">
              Please provide your response to the claim:
            </p>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Enter your response to the claim..."
              className="mb-4"
              rows={6}
            />
          </div>
          <Button 
            onClick={handleSubmitResponse}
            disabled={!response.trim()}
          >
            Submit Response
          </Button>
        </>
      ) : (
        <p>Please provide a case ID</p>
      )}
    </div>
  )
}

