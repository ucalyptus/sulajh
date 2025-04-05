import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { prisma } from "@/lib/prisma"
import type { Case } from "@/types/case"

const getEmptyStateMessage = (role: string) => {
  switch (role) {
    case 'CLAIMANT':
      return "You haven't filed any cases yet."
    case 'RESPONDENT':
      return "You haven't received any cases yet."
    case 'NEUTRAL':
      return "You haven't received mediation requests for any cases yet."
    case 'CASE_MANAGER':
      return "You haven't been assigned any cases yet."
    default:
      return "No cases found."
  }
}

export default async function CasesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const role = session.user.role
  const userId = session.user.id

  const cases = await prisma.case.findMany({
    where: {
      OR: [
        { claimantId: userId },
        { respondentId: userId },
        { neutralId: userId },
        { caseManagerId: userId },
      ],
    },
    include: {
      claimant: {
        select: { id: true, name: true, email: true },
      },
      respondent: {
        select: { id: true, name: true, email: true },
      },
      neutral: {
        select: { id: true, name: true, email: true },
      },
      caseManager: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Cases</h1>
        {role === "CLAIMANT" && (
          <Button asChild>
            <Link href="/cases/new">File a New Case</Link>
          </Button>
        )}
      </div>

      {cases.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">{getEmptyStateMessage(role)}</p>
          {role === "CLAIMANT" && (
            <Button asChild className="mt-4">
              <Link href="/cases/new">File Your First Case</Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {cases.map((case_: Case) => (
            <Link key={case_.id} href={`/cases/${case_.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold mb-2">Case #{case_.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Status: {case_.status}
                    </p>
                    {role === "REGISTRAR" && (
                      <>
                        <p className="text-sm text-gray-600">
                          Claimant: {case_.claimant?.name || case_.claimant?.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          Respondent: {case_.respondent?.name || case_.respondent?.email}
                        </p>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(case_.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 