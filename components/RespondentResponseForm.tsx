'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface RespondentResponseFormProps {
  caseId: string
  token: string
}

export function RespondentResponseForm({ caseId, token }: RespondentResponseFormProps) {
  const router = useRouter()
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/cases/${caseId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response,
          token
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit response')
      }

      toast.success('Response submitted successfully')
      router.push(`/cases/${caseId}`)
    } catch (error) {
      console.error('Error submitting response:', error)
      toast.error('Failed to submit response')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Your Response
        </label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={6}
          className="w-full p-2 border rounded"
          placeholder="Provide your response to the claim..."
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Your response will be shared with all parties involved in the case.
        </p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Response'}
        </Button>
      </div>
    </form>
  )
} 