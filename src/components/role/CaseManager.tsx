'use client'

import { aiCaseManagerPreProceeding } from '@/src/server/ai'
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
  headerBox: {
    marginBottom: spacing[4],
  },
  heading: {
    fontSize: '1.125rem',
    fontWeight: 600,
    margin: 0,
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

export function CaseManager() {
  const router = useRouter()
  const searchParams = useSearch({ strict: false }) as Record<string, string>
  const caseId = searchParams['caseId'] || null
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handlePreProceeding = async () => {
    if (!caseId) return
    setIsRunning(true)
    setError('')

    try {
      const summary = await aiCaseManagerPreProceeding({ data: { caseId } })
      setResult(summary)
      // Route to the respondent flow once the pre-proceeding summary exists.
      router.navigate({ to: '/respondent', search: { caseId } })
    } catch (err) {
      console.error('Pre-proceeding failed:', err)
      setError(err instanceof Error ? err.message : 'Pre-proceeding failed')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      {caseId ? (
        <>
          <div {...stylex.props(styles.headerBox)}>
            <h2 {...stylex.props(styles.heading)}>Case Management</h2>
            <p>Case ID: {caseId}</p>
          </div>
          {error && <p {...stylex.props(styles.errorText)}>{error}</p>}
          <Button onClick={handlePreProceeding} disabled={isRunning}>
            {isRunning ? 'Working...' : 'Conduct Pre-proceeding Call'}
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
