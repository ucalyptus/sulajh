'use client'

import { useState } from 'react'
import { respondToCase } from '@/src/server/cases'
import { useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helperText: {
    fontSize: '0.875rem',
    color: colors.gray500,
    margin: 0,
  },
})

interface RespondentResponseFormProps {
  caseId: string
  token: string
}

export function RespondentResponseForm({ caseId, token }: RespondentResponseFormProps) {
  const router = useRouter()
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await respondToCase({ data: { caseId, response, token } })
      toast.success('Response submitted successfully')
      router.navigate({ to: '/cases/$id', params: { id: caseId } })
    } catch (error) {
      console.error('Error submitting response:', error)
      toast.error('Failed to submit response')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} {...stylex.props(styles.form)}>
      <div {...stylex.props(styles.fieldGroup)}>
        <Label htmlFor="response">Your Response</Label>
        <Textarea
          id="response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={6}
          placeholder="Provide your response to the claim..."
          required
        />
      </div>

      <div {...stylex.props(styles.footer)}>
        <p {...stylex.props(styles.helperText)}>
          Your response will be shared with all parties involved in the case.
        </p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Response'}
        </Button>
      </div>
    </form>
  )
}
