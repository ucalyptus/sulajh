'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { logger } from '@/lib/logger'

export default function CasesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Cases error', error, { component: 'CasesError', digest: error.digest })
  }, [error])

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Failed to load cases
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An error occurred while loading cases.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Link href="/dashboard">
            <Button variant="outline">Go to dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
