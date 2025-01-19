'use client'

import { useCompletion } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { CaseState } from '@/types'
import { useRouter } from 'next/navigation'

export function Claimant() {
  const router = useRouter()
  const [request, setRequest] = useState('')
  const { complete } = useCompletion({ api: '/api/claimant' })

  const handleSubmit = async () => {
    const response = await complete(request)
    const caseId = Math.random().toString(36).substring(7)
    const newCase: CaseState = {
      id: caseId,
      status: 'claimant_submitted',
      claimantRequest: response
    }
    // Here you would typically save the case to a database
    console.log('New case created:', newCase)
    localStorage.setItem(`case_${caseId}_claim`, response)
    router.push(`/platform?caseId=${caseId}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Textarea
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        placeholder="Describe your dispute..."
        className="mb-4"
        rows={6}
      />
      <Button onClick={handleSubmit}>Submit Request</Button>
    </div>
  )
}

