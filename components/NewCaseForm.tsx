'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function NewCaseForm() {
  const [claimDetails, setClaimDetails] = useState('')
  const [respondentEmail, setRespondentEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claimantRequest: claimDetails,
          respondentEmail,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit claim')
      }

      router.push(`/cases/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit claim')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Claim Details <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={6}
            value={claimDetails}
            onChange={(e) => setClaimDetails(e.target.value)}
            placeholder="Describe your claim in detail"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Respondent Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={respondentEmail}
            onChange={(e) => setRespondentEmail(e.target.value)}
            placeholder="Enter respondent's email"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Claim'}
        </button>
      </div>
    </form>
  )
} 