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
  headerBox: {
    marginBottom: spacing[4],
  },
  heading: {
    fontSize: '1.125rem',
    fontWeight: 600,
    margin: 0,
  },
})

export function CaseManager() {
  const router = useRouter()
  const searchParams = useSearch({ strict: false }) as Record<string, string>
  const caseId = searchParams['caseId'] || null
  const { complete } = useCompletion({ api: '/api/case-manager' })

  const handlePreProceeding = async () => {
    if (!caseId) return
    const response = await complete(caseId)
    console.log('Pre-proceeding completed for case:', caseId, response)
    router.navigate({ to: '/respondent', search: { caseId } })
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      {caseId ? (
        <>
          <div {...stylex.props(styles.headerBox)}>
            <h2 {...stylex.props(styles.heading)}>Case Management</h2>
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
