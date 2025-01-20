'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Case {
  id: string
  status: string
  claimant: {
    name?: string
    email: string
  }
  respondent?: {
    name?: string
    email: string
  }
}

export default function CasesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      console.log('Fetching cases...') // Debug log
      fetch('/api/cases', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`Failed to fetch cases: ${errorText}`)
          }
          return res.json()
        })
        .then(data => {
          console.log('Cases data:', data) // Debug log
          setCases(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching cases:', error)
          setError(error.message)
          setLoading(false)
        })
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Cases</h1>
        <p>Loading cases...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Cases</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (cases.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Cases</h1>
        <p>No cases found.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cases</h1>
      <div className="space-y-4">
        {cases.map((case_) => (
          <div 
            key={case_.id} 
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            onClick={() => router.push(`/cases/${case_.id}`)}
            role="button"
            tabIndex={0}
          >
            <h2 className="font-semibold">Case #{case_.id}</h2>
            <p className="text-sm text-gray-600">Status: {case_.status}</p>
            <p className="text-sm text-gray-600">
              Claimant: {case_.claimant?.name || case_.claimant?.email}
            </p>
            {case_.respondent && (
              <p className="text-sm text-gray-600">
                Respondent: {case_.respondent?.name || case_.respondent?.email}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 