'use client'

import { useState } from 'react'
import { User, Case } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type CaseWithParties = Case & {
  claimant: User
  respondent: User | null
  caseManager: User | null
}

interface CaseAssignmentProps {
  case_: CaseWithParties
  caseManagers: User[]
  neutrals: User[]
  onAssign: () => void
}

export function CaseAssignment({ case_, caseManagers, neutrals, onAssign }: CaseAssignmentProps) {
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedCaseManager, setSelectedCaseManager] = useState('')
  const [selectedNeutral, setSelectedNeutral] = useState('')

  const handleAssign = async () => {
    try {
      const response = await fetch(`/api/cases/${case_.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseManagerId: selectedCaseManager || null,
          neutralId: selectedNeutral || null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to assign case')
      }

      toast.success('Case assigned successfully')
      setIsAssigning(false)
      onAssign()
    } catch (error) {
      console.error('Error assigning case:', error)
      toast.error('Failed to assign case')
    }
  }

  return (
    <div>
      <Button 
        variant="outline" 
        onClick={() => setIsAssigning(!isAssigning)}
      >
        Assign Case
      </Button>

      {isAssigning && (
        <div className="mt-4 space-y-4 bg-white p-4 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium mb-2">
              Case Manager
            </label>
            <select
              value={selectedCaseManager}
              onChange={(e) => setSelectedCaseManager(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Case Manager</option>
              {caseManagers.map((cm) => (
                <option key={cm.id} value={cm.id}>
                  {cm.name} ({cm.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Neutral
            </label>
            <select
              value={selectedNeutral}
              onChange={(e) => setSelectedNeutral(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Neutral</option>
              {neutrals.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} ({n.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setIsAssigning(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAssign}>
              Confirm Assignment
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 