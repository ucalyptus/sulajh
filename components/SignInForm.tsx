'use client'

import { useState } from 'react'
import { signIn } from '@/src/server/auth'
import { useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@/styles/tokens.stylex'

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
  errorText: {
    color: colors.red500,
    fontSize: '0.875rem',
    margin: 0,
  },
  submitButton: {
    width: '100%',
  },
})

export default function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.navigate({ to: '/dashboard' })
        router.invalidate()
      }
    } catch (err: any) {
      setError('An error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} {...stylex.props(styles.form)}>
      <div {...stylex.props(styles.fieldGroup)}>
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div {...stylex.props(styles.fieldGroup)}>
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <p {...stylex.props(styles.errorText)}>{error}</p>
      )}
      <Button
        type="submit"
        style={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
