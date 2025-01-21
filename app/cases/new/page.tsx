import { NewCaseForm } from '@/components/NewCaseForm'
import { requireAuth } from '@/lib/auth'

export default async function NewCasePage() {
  const session = await requireAuth(['CLAIMANT'])
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">File a New Claim</h1>
      <NewCaseForm />
    </div>
  )
} 