import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { Neutral } from '@/src/components/role'
import { Suspense } from 'react'
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
  if (session.role !== 'NEUTRAL') throw redirect({ to: '/dashboard' })
  return session
})

export const Route = createFileRoute('/neutral')({
  component: NeutralPage,
  loader: () => requireRole(),
})

function NeutralPage() {
  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.heading)}>Neutral Panel</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Neutral />
      </Suspense>
    </div>
  )
}
