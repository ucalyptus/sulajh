import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { Claimant } from '@/src/components/role'

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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">File Your Claim</h1>
      <Claimant />
    </div>
  )
}
