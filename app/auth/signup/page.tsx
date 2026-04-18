import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import SignUpForm from '@/components/SignUpForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
}

interface SignUpPageProps {
  searchParams: { invitation?: string }
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  let invitationData = null
  if (searchParams.invitation) {
    const invitation = await prisma.caseInvitation.findUnique({
      where: { token: searchParams.invitation },
      select: { email: true }
    })
    if (invitation) {
      invitationData = {
        email: invitation.email,
        token: searchParams.invitation
      }
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            {invitationData ? 'Complete Your Registration' : 'Create an Account'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {invitationData
              ? 'You\u0027ve been invited to respond to a case'
              : 'Start resolving disputes with Sulajh'}
          </p>
        </div>
        <SignUpForm invitationData={invitationData} />
        {!invitationData && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        )}
      </Card>
    </div>
  )
} 