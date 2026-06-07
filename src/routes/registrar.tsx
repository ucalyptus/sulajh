import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { Registrar } from '@/app/components'
import { Suspense } from 'react'

const requireRole = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session) throw redirect({ to: '/auth/signin' })
  if (session.role !== 'REGISTRAR') throw redirect({ to: '/dashboard' })
  return session
})

export const Route = createFileRoute('/registrar')({
  component: RegistrarPage,
  loader: () => requireRole(),
})

function RegistrarPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Registrar Portal</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Registrar />
      </Suspense>
    </div>
  )
}
