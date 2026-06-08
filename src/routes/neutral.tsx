import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { Neutral } from '@/app/components'
import { Suspense } from 'react'

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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Neutral Panel</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Neutral />
      </Suspense>
    </div>
  )
}
