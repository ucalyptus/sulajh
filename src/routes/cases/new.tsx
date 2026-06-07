import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { NewCaseForm } from '@/components/NewCaseForm'

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
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">File a New Claim</h1>
      <NewCaseForm />
    </div>
  )
}
