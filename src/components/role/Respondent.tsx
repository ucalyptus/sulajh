'use client'

import { aiRespondentAssist } from '@/src/server/ai'
import { respondToCase } from '@/src/server/cases'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@/styles/tokens.stylex'

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
    marginBottom: spacing[2],
  },
  caseIdText: {
    marginBottom: spacing[2],
  },
  subtitleText: {
    fontSize: '0.875rem',
    color: colors.gray600,
    marginBottom: spacing[4],
  },
  textarea: {
    marginBottom: spacing[4],
  },
  errorText: {
    color: colors.red500,
    fontSize: '0.875rem',
  },
})

export function Respondent() {
  const router = useRouter()
  const searchParams = useSearch({ strict: false }) as Record<string, string>
  const caseId = searchParams['caseId'] || null
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitResponse = async () => {
    if (!caseId || !response.trim()) return
    setIsSubmitting(true)
    setError('')

    try {
      // AI-assisted structuring of the respondent's position.
      await aiRespondentAssist({ data: { caseId, responseText: response } })

      await respondToCase({ data: { caseId, response } })
      router.navigate({ to: '/cases/$id', params: { id: caseId } })
    } catch (err) {
      console.error('Error submitting response:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit response')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      {caseId ? (
        <>
          <div {...stylex.props(styles.headerBox)}>
            <h2 {...stylex.props(styles.heading)}>Respond to Case</h2>
            <p {...stylex.props(styles.caseIdText)}>Case ID: {caseId}</p>
            <p {...stylex.props(styles.subtitleText)}>
              Please provide your response to the claim:
            </p>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Enter your response to the claim..."
              style={styles.textarea}
              rows={6}
            />
          </div>
          {error && <p {...stylex.props(styles.errorText)}>{error}</p>}
          <Button 
            onClick={handleSubmitResponse}
            disabled={!response.trim() || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Response'}
          </Button>
        </>
      ) : (
        <p>Please provide a case ID</p>
      )}
    </div>
  )
}
