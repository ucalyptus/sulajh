'use client'

import { useCompletion } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearch } from '@tanstack/react-router'

export function Registrar() {
  const router = useRouter()
  const searchParams = useSearch({ strict: false }) as Record<string, string>
  const caseId = searchParams['caseId'] || null
  const { complete } = useCompletion({ api: '/api/registrar' })

  const handleAssignCaseManager = async () => {
    if (!caseId) return
    const response = await complete(caseId)
    // Here you would typically update the case in a database
    console.log('Case manager assigned for case:', caseId, response)
    // Redirect to case manager page
    router.navigate({ to: '/case-manager', search: { caseId } })
  }

  return (
    <div className="max-w-2xl mx-auto">
      {caseId ? (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Case Details</h2>
            <p>Case ID: {caseId}</p>
          </div>
          <Button onClick={handleAssignCaseManager}>
            Assign Case Manager
          </Button>
        </>
      ) : (
        <p>Please provide a case ID</p>
      )}
    </div>
  )
}

