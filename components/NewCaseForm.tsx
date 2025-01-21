'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function NewCaseForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    respondentEmail: '',
    claimDetails: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to create case')
      }

      const data = await response.json()
      toast.success('Case created successfully')
      router.push(`/cases/${data.id}`)
    } catch (error) {
      console.error('Error creating case:', error)
      toast.error('Failed to create case')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Respondent&apos;s Email
        </label>
        <input
          type="email"
          value={formData.respondentEmail}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            respondentEmail: e.target.value
          }))}
          className="w-full p-2 border rounded"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          The email address of the party you wish to raise a dispute with
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Claim Details
        </label>
        <textarea
          value={formData.claimDetails}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            claimDetails: e.target.value
          }))}
          rows={6}
          className="w-full p-2 border rounded"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Please provide a clear description of your claim
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Claim'}
      </Button>
    </form>
  )
} 