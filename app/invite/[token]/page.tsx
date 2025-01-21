import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function InvitePage({ params }: { params: { token: string } }) {
  const session = await getServerSession(authOptions)
  
  // Find the invitation
  const invitation = await prisma.caseInvitation.findUnique({
    where: { token: params.token },
    include: { case: true }
  })

  if (!invitation || invitation.status !== 'PENDING' || invitation.expiresAt < new Date()) {
    redirect('/invalid-invitation')
  }

  if (!session) {
    // If user is not logged in, redirect to sign up with invitation token
    redirect(`/auth/signup?invitation=${params.token}`)
  }

  // If user is logged in, associate them with the case as respondent
  await prisma.$transaction(async (tx) => {
    // Update user role to RESPONDENT if not already
    await tx.user.update({
      where: { id: session.user.id },
      data: { role: 'RESPONDENT' }
    })

    // Update the case with respondent
    await tx.case.update({
      where: { id: invitation.caseId },
      data: {
        respondentId: session.user.id,
        status: 'RESPONSE_PENDING'
      }
    })

    // Mark invitation as accepted
    await tx.caseInvitation.update({
      where: { id: invitation.id },
      data: { status: 'ACCEPTED' }
    })
  })

  // Redirect to the case page
  redirect(`/cases/${invitation.caseId}`)
} 