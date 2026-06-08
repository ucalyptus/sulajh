import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { Respondent } from '@/src/components/role'
import { Suspense } from 'react'

const requireRole = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session) throw redirect({ to: '/auth/signin' })
  if (session.role !== 'RESPONDENT') throw redirect({ to: '/dashboard' })
  return session
})

export const Route = createFileRoute('/respondent')({
  component: RespondentPage,
  loader: () => requireRole(),
})

function RespondentPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Respond to Claim</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Respondent />
      </Suspense>
    </div>
  )
}
