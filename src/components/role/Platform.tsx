'use client'

import { aiPlatformNotifyRegistrar } from '@/src/server/ai'
import { Button } from '@/components/ui/button'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  wrapper: {
    maxWidth: '42rem',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  text: {
    marginBottom: spacing[4],
  },
  resultBox: {
    marginTop: spacing[4],
    padding: spacing[4],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.gray50,
  },
  preText: {
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  errorText: {
    color: colors.red500,
    fontSize: '0.875rem',
  },
})

export function Platform() {
  const router = useRouter()
  const searchParams = useSearch({ strict: false }) as Record<string, string>
  const caseId = searchParams['caseId'] || null
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [isNotifying, setIsNotifying] = useState(false)

  const handleNotifyRegistrar = async () => {
    if (!caseId) return
    setIsNotifying(true)
    setError('')

    try {
      const notification = await aiPlatformNotifyRegistrar({ data: { caseId } })
      setResult(notification)
      router.navigate({ to: '/registrar', search: { caseId } })
    } catch (err) {
      console.error('Notification failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to notify registrar')
    } finally {
      setIsNotifying(false)
    }
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      {caseId ? (
        <>
          <p {...stylex.props(styles.text)}>Case ID: {caseId}</p>
          {error && <p {...stylex.props(styles.errorText)}>{error}</p>}
          <Button onClick={handleNotifyRegistrar} disabled={isNotifying}>
            {isNotifying ? 'Notifying...' : 'Notify Registrar'}
          </Button>
          {result && (
            <div {...stylex.props(styles.resultBox)}>
              <div {...stylex.props(styles.preText)}>{result}</div>
            </div>
          )}
        </>
      ) : (
        <p>Please provide a case ID</p>
      )}
    </div>
  )
}
