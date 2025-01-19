'use client'

import { useCompletion } from 'ai/react'
import { Button } from '@/components/ui/button'
import { useSearchParams, useRouter } from 'next/navigation'

export function Platform() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const caseId = searchParams.get('caseId')
  const { complete } = useCompletion({ api: '/api/platform' })

  const handleNotifyRegistrar = async () => {
    if (!caseId) return
    const response = await complete(caseId)
    // Here you would typically update the case in a database
    console.log('Registrar notified for case:', caseId, response)
    // Redirect to registrar page with the case ID
    router.push(`/registrar?caseId=${caseId}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {caseId ? (
        <>
          <p className="mb-4">Case ID: {caseId}</p>
          <Button onClick={handleNotifyRegistrar}>
            Notify Registrar
          </Button>
        </>
      ) : (
        <p>Please provide a case ID</p>
      )}
    </div>
  )
}

