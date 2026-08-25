import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { CaseManager } from '@/src/components/role'
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
  if (session.role !== 'CASE_MANAGER') throw redirect({ to: '/dashboard' })
  return session
})

export const Route = createFileRoute('/case-manager')({
  component: CaseManagerPage,
  loader: () => requireRole(),
})

function CaseManagerPage() {
  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.heading)}>Case Manager</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CaseManager />
      </Suspense>
    </div>
  )
}
