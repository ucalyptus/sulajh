import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { Claimant } from '@/src/components/role'
import * as stylex from '@stylexjs/stylex'
import { spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  container: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: spacing[8],
  },
  heading: {
    fontSize: '1.875rem',
    fontWeight: 700,
    marginBottom: spacing[6],
    margin: 0,
  },
})

const requireRole = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session) throw redirect({ to: '/auth/signin' })
  if (session.role !== 'CLAIMANT') throw redirect({ to: '/dashboard' })
  return session
})

export const Route = createFileRoute('/claimant')({
  component: ClaimantPage,
  loader: () => requireRole(),
})

function ClaimantPage() {
  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.heading)}>File Your Claim</h1>
      <Claimant />
    </div>
  )
}
