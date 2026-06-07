import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { CaseManager } from '@/app/components'
import { Suspense } from 'react'

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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Case Manager</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CaseManager />
      </Suspense>
    </div>
  )
}
