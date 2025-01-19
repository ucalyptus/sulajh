import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { RespondentResponseForm } from '@/components/RespondentResponseForm'

export default async function RespondPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { token: string }
}) {
  // Verify invitation token
  const invitation = await prisma.caseInvitation.findFirst({
    where: {
      caseId: params.id,
      token: searchParams.token,
      status: 'PENDING',
      expiresAt: {
        gt: new Date()
      }
    },
    include: {
      case: {
        include: {
          claimant: true
        }
      }
    }
  })

  if (!invitation) {
    redirect('/invalid-invitation')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Respond to Case #{params.id}</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Claim Details</h2>
        <p className="text-gray-700 whitespace-pre-wrap mb-4">
          {invitation.case.claimantRequest}
        </p>
        <p className="text-sm text-gray-500">
          Filed by: {invitation.case.claimant.name || invitation.case.claimant.email}
        </p>
      </div>

      <RespondentResponseForm 
        caseId={params.id} 
        token={searchParams.token}
      />
    </div>
  )
} 