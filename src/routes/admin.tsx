import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'

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
    <div className="container mx-auto p-8">
      <Outlet />
    </div>
  )
}
