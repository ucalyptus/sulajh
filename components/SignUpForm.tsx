'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  const [role, setRole] = useState<'CLAIMANT' | 'RESPONDENT' | 'NEUTRAL'>('CLAIMANT')
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
          role: invitationData ? 'RESPONDENT' : role,
          invitationToken: invitationData?.token
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up')
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push(invitationData ? `/invite/${invitationData.token}` : '/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={!!invitationData}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
      </div>

      {!invitationData && (
        <div className="space-y-2">
          <Label>I am a…</Label>
          <Select
            value={role}
            onValueChange={(value: 'CLAIMANT' | 'RESPONDENT' | 'NEUTRAL') => setRole(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CLAIMANT">Claimant — I want to file a dispute</SelectItem>
              <SelectItem value="RESPONDENT">Respondent — I received a dispute</SelectItem>
              <SelectItem value="NEUTRAL">Neutral — I mediate disputes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account…' : 'Create Account'}
      </Button>
    </form>
  )
} 