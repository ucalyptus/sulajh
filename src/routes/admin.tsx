import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import * as stylex from '@stylexjs/stylex'
import { spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  container: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: spacing[8],
  },
})

const requireAdmin = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session) throw redirect({ to: '/auth/signin' })
  if (session.role !== 'REGISTRAR') throw redirect({ to: '/dashboard' })
  return session
})

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
  loader: () => requireAdmin(),
})

function AdminLayout() {
  return (
    <div {...stylex.props(styles.container)}>
      <Outlet />
    </div>
  )
}
