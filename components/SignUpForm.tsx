'use client'

import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/src/server/auth'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  helperText: {
    fontSize: '0.75rem',
    color: colors.mutedForeground,
    margin: 0,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: colors.destructive,
    fontSize: '0.875rem',
    padding: spacing[3],
    borderRadius: radii.md,
  },
  submitButton: {
    width: '100%',
  },
})

type InvitationData = {
  email: string
  token: string
} | null

interface SignUpFormProps {
  invitationData: InvitationData
}

export default function SignUpForm({ invitationData }: SignUpFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState(invitationData?.email || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'CLAIMANT' | 'RESPONDENT' | 'NEUTRAL'>('CLAIMANT')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signUp({
        name,
        email,
        password,
        role: invitationData ? 'RESPONDENT' : role,
        invitationToken: invitationData?.token,
      })

      if (result.error) {
        setError(result.error)
      } else {
        router.navigate({ to: '/dashboard' })
        router.invalidate()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} {...stylex.props(styles.form)}>
      <div {...stylex.props(styles.fieldGroup)}>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
        />
      </div>
      
      <div {...stylex.props(styles.fieldGroup)}>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          disabled={Boolean(invitationData)}
          required
        />
      </div>

      <div {...stylex.props(styles.fieldGroup)}>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <p {...stylex.props(styles.helperText)}>Must be at least 6 characters</p>
      </div>

      {!invitationData && (
        <div {...stylex.props(styles.fieldGroup)}>
          <Label>I am a…</Label>
          <Select
            value={role}
            onValueChange={(v) => setRole(v as 'CLAIMANT' | 'RESPONDENT' | 'NEUTRAL')}
          >
            <SelectTrigger style={{ width: '100%' }}>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CLAIMANT">Claimant (Filing a claim)</SelectItem>
              <SelectItem value="RESPONDENT">Respondent (Responding to a claim)</SelectItem>
              <SelectItem value="NEUTRAL">Neutral (Mediator/Arbitrator)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {error && (
        <div {...stylex.props(styles.errorBox)}>
          {error}
        </div>
      )}

      <Button
        type="submit"
        style={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? 'Creating account…' : 'Create Account'}
      </Button>
    </form>
  )
}
