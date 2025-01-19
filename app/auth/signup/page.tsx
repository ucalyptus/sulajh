import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import SignUpForm from '@/components/SignUpForm'

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
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {invitationData ? 'Complete Your Registration' : 'Sign Up'}
        </h1>
        <SignUpForm invitationData={invitationData} />
      </div>
    </div>
  )
} 