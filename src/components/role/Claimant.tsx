'use client'

import { aiClaimantAssist } from '@/src/server/ai'
import { createCase } from '@/src/server/cases'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  wrapper: {
    maxWidth: '42rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  errorText: {
    color: colors.red500,
    fontSize: '0.875rem',
  },
})

export function Claimant() {
  const router = useRouter()
  const [request, setRequest] = useState('')
  const [respondentEmail, setRespondentEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!respondentEmail.trim()) {
      setError('Respondent email is required')
      return
    }
    setIsSubmitting(true)
    setError('')

    try {
      // AI-assisted structuring of the claim narrative before filing.
      const structured = await aiClaimantAssist({ data: { request } })

      const result = await createCase({
        data: {
          claimantRequest: structured || request,
          respondentEmail,
        },
      })

      router.navigate({ to: '/cases/$id', params: { id: String(result.id) } })
    } catch (err) {
      console.error('Error filing claim:', err)
      setError(err instanceof Error ? err.message : 'Failed to file claim')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      <Textarea
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        placeholder="Describe your dispute..."
        rows={6}
      />
      <div {...stylex.props(styles.fieldGroup)}>
        <Label htmlFor="claimant-respondent-email">Respondent Email</Label>
        <Input
          id="claimant-respondent-email"
          type="email"
          value={respondentEmail}
          onChange={(e) => setRespondentEmail(e.target.value)}
          placeholder="respondent@example.com"
          required
        />
      </div>
      {error && <p {...stylex.props(styles.errorText)}>{error}</p>}
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Filing...' : 'Submit Request'}
      </Button>
    </div>
  )
}
