'use client'

import { useCompletion } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearch } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'
import { spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  wrapper: {
    maxWidth: '42rem',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  text: {
    marginBottom: spacing[4],
  },
})

export function Platform() {
  const router = useRouter()
  const searchParams = useSearch({ strict: false }) as Record<string, string>
  const caseId = searchParams['caseId'] || null
  const { complete } = useCompletion({ api: '/api/platform' })

  const handleNotifyRegistrar = async () => {
    if (!caseId) return
    const response = await complete(caseId)
    console.log('Registrar notified for case:', caseId, response)
    router.navigate({ to: '/registrar', search: { caseId } })
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      {caseId ? (
        <>
          <p {...stylex.props(styles.text)}>Case ID: {caseId}</p>
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
