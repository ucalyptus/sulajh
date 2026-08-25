import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { signIn } from '@/src/server/auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  wrapper: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  },
  card: {
    maxWidth: '28rem',
    width: '100%',
    padding: spacing[8],
  },
  header: {
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    marginTop: spacing[1],
    margin: 0,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: colors.destructive,
    fontSize: '0.875rem',
    padding: spacing[3],
    borderRadius: radii.md,
    marginBottom: spacing[4],
  },
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
  submitButton: {
    width: '100%',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    marginTop: spacing[6],
    margin: 0,
  },
  link: {
    color: colors.primary,
    fontWeight: 500,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
})

export const Route = createFileRoute('/auth/signin')({
  component: SignInPage,
})

function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signIn({ data: { email, password } })
      router.navigate({ to: '/dashboard' })
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      <Card style={styles.card}>
        <div {...stylex.props(styles.header)}>
          <h1 {...stylex.props(styles.title)}>Welcome Back</h1>
          <p {...stylex.props(styles.subtitle)}>
            Sign in to your Sulajh account
          </p>
        </div>
        {error && (
          <div {...stylex.props(styles.errorBox)}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} {...stylex.props(styles.form)}>
          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
        <p {...stylex.props(styles.footerText)}>
          Don&apos;t have an account?{' '}
          <Link to="/auth/signup" {...stylex.props(styles.link)}>
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}
