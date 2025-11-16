'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { CaseWithRelations, UserBasicInfo } from '@/app/types'

interface CaseDetailUIProps {
  caseData: CaseWithRelations
  availableUsers: {
    caseManagers: UserBasicInfo[]
    neutrals: UserBasicInfo[]
  }
}

export function CaseDetailUI({ caseData, availableUsers }: CaseDetailUIProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState({
    caseManager: '',
    neutral: ''
  })

  const assignUser = async (role: 'caseManager' | 'neutral', userId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/cases/${caseData.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to assign user')
      }

      toast.success(`${role === 'caseManager' ? 'Case Manager' : 'Neutral'} assigned successfully`)
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign user'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Case #{caseData.id}</h1>
        <Badge className="mt-2">
          {caseData.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Parties</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Claimant</dt>
              <dd className="mt-1 text-sm">
                {caseData.claimant.name || caseData.claimant.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Respondent</dt>
              <dd className="mt-1 text-sm">
                {caseData.respondent?.name || caseData.respondent?.email || 'Not assigned'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Case Management</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Case Manager
              </label>
              <div className="flex gap-4 items-start">
                <Select
                  disabled={loading}
                  value={selectedUsers.caseManager}
                  onValueChange={(value) => setSelectedUsers(prev => ({ ...prev, caseManager: value }))}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder={
                      caseData.caseManager
                        ? `Current: ${caseData.caseManager.name || caseData.caseManager.email}`
                        : "Select Case Manager"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.caseManagers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  disabled={!selectedUsers.caseManager || loading}
                  onClick={() => assignUser('caseManager', selectedUsers.caseManager)}
                >
                  Assign
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Neutral
              </label>
              <div className="flex gap-4 items-start">
                <Select
                  disabled={loading}
                  value={selectedUsers.neutral}
                  onValueChange={(value) => setSelectedUsers(prev => ({ ...prev, neutral: value }))}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder={
                      caseData.neutral
                        ? `Current: ${caseData.neutral.name || caseData.neutral.email}`
                        : "Select Neutral"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.neutrals.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  disabled={!selectedUsers.neutral || loading}
                  onClick={() => assignUser('neutral', selectedUsers.neutral)}
                >
                  Assign
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 