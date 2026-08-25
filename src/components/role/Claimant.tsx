'use client'

import { useCompletion } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { CaseState } from '@/src/types'
import { useRouter } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'
import { spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  wrapper: {
    maxWidth: '42rem',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textarea: {
    marginBottom: spacing[4],
  },
})

export function Claimant() {
  const router = useRouter()
  const [request, setRequest] = useState('')
  const { complete } = useCompletion({ api: '/api/claimant' })

  const handleSubmit = async () => {
    const response = await complete(request)
    const caseId = Math.random().toString(36).substring(7)
    const newCase: CaseState = {
      id: caseId,
      status: 'claimant_submitted',
      claimantRequest: response ?? undefined
    }
    console.log('New case created:', newCase)
    localStorage.setItem(`case_${caseId}_claim`, response ?? '')
    router.navigate({ to: '/platform', search: { caseId } })
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      <Textarea
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        placeholder="Describe your dispute..."
        style={styles.textarea}
        rows={6}
      />
      <Button onClick={handleSubmit}>Submit Request</Button>
    </div>
  )
}
