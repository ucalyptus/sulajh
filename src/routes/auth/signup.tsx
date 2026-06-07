import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import SignUpForm from '@/components/SignUpForm'

const getSignUpData = createServerFn({ method: 'GET' })
  .validator((d: { invitation?: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSession()
    if (session) throw redirect({ to: '/dashboard' })

    let invitationData = null
    if (data.invitation) {
      const invitation = await prisma.caseInvitation.findUnique({
        where: { token: data.invitation },
        select: { email: true },
      })
      if (invitation) {
        invitationData = { email: invitation.email, token: data.invitation }
      }
    }

    return { invitationData }
  })

export const Route = createFileRoute('/auth/signup')({
  validateSearch: (search: Record<string, unknown>) => ({
    invitation: (search.invitation as string) || undefined,
  }),
  component: SignUpPage,
  loader: ({ context, search }) =>
    getSignUpData({ data: { invitation: search.invitation } }),
})

function SignUpPage() {
  const { invitationData } = Route.useLoaderData()

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            {invitationData ? 'Complete Your Registration' : 'Create an Account'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {invitationData
              ? "You've been invited to respond to a case"
              : 'Start resolving disputes with Sulajh'}
          </p>
        </div>
        <SignUpForm invitationData={invitationData} />
        {!invitationData && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/auth/signin" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        )}
      </Card>
    </div>
  )
}
