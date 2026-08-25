'use client'

import { aiRegistrarAssign } from '@/src/server/ai'
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

export function Registrar() {
  const router = useRouter()
  const searchParams = useSearch({ strict: false }) as Record<string, string>
  const caseId = searchParams['caseId'] || null
  const [recommendation, setRecommendation] = useState('')
  const [error, setError] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)

  const handleAssignCaseManager = async () => {
    if (!caseId) return
    setIsAssigning(true)
    setError('')

    try {
      // AI recommendation for staffing; the actual assignment happens
      // through assignCase on the admin page.
      const rec = await aiRegistrarAssign({ data: { caseId } })
      setRecommendation(rec)
      router.navigate({ to: '/case-manager', search: { caseId } })
    } catch (err) {
      console.error('Assignment failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to process assignment')
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      {caseId ? (
        <>
          <div {...stylex.props(styles.headerBox)}>
            <h2 {...stylex.props(styles.heading)}>Case Details</h2>
            <p>Case ID: {caseId}</p>
          </div>
          {error && <p {...stylex.props(styles.errorText)}>{error}</p>}
          <Button onClick={handleAssignCaseManager} disabled={isAssigning}>
            {isAssigning ? 'Processing...' : 'Assign Case Manager'}
          </Button>
          {recommendation && (
            <div {...stylex.props(styles.resultBox)}>
              <div {...stylex.props(styles.preText)}>{recommendation}</div>
            </div>
          )}
        </>
      ) : (
        <p>Please provide a case ID</p>
      )}
    </div>
  )
}
