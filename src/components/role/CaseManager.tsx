'use client'

import { useCompletion } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearch } from '@tanstack/react-router'

export function CaseManager() {
  const router = useRouter()
  const searchParams = useSearch({ strict: false }) as Record<string, string>
  const caseId = searchParams['caseId'] || null
  const { complete } = useCompletion({ api: '/api/case-manager' })

  const handlePreProceeding = async () => {
    if (!caseId) return
    const response = await complete(caseId)
    // Here you would typically update the case in a database
    console.log('Pre-proceeding completed for case:', caseId, response)
    // Redirect to respondent page with the case ID
    router.navigate({ to: '/respondent', search: { caseId } })
  }

  return (
    <div className="max-w-2xl mx-auto">
      {caseId ? (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Case Management</h2>
            <p>Case ID: {caseId}</p>
          </div>
          <Button onClick={handlePreProceeding}>
            Conduct Pre-proceeding Call
          </Button>
        </>
      ) : (
        <p>Please provide a case ID</p>
      )}
    </div>
  )
}

