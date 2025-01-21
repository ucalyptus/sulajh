'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

type InvitationData = {
  email: string
  token: string
} | null

interface SignUpFormProps {
  invitationData: InvitationData
}

export default function SignUpForm({ invitationData }: SignUpFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState(invitationData?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          role: invitationData ? 'RESPONDENT' : 'CLAIMANT',
          invitationToken: invitationData?.token
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up')
      }

      // Sign in the user
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        // If there's an invitation, redirect to the case
        // Otherwise, go to dashboard
        router.push(invitationData ? `/invite/${invitationData.token}` : '/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Sign up error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred during sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={!!invitationData}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          minLength={6}
          required
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </form>
  )
} 