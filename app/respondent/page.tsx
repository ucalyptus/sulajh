import { Suspense } from 'react'
import { Respondent } from '../components'

export default function RespondentPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Respond to Claim</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Respondent />
      </Suspense>
    </div>
  )
} 