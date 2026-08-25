import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { NewCaseForm } from '@/components/NewCaseForm'
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
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: spacing[8],
    margin: 0,
  },
})

const requireClaimant = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session) throw redirect({ to: '/auth/signin' })
  if (session.role !== 'CLAIMANT' && session.role !== 'REGISTRAR') {
    throw redirect({ to: '/dashboard' })
  }
  return session
})

export const Route = createFileRoute('/cases/new')({
  component: NewCasePage,
  loader: () => requireClaimant(),
  head: () => ({ meta: [{ title: 'File New Claim | Sulajh' }] }),
})

function NewCasePage() {
  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.heading)}>File a New Claim</h1>
      <NewCaseForm />
    </div>
  )
}
