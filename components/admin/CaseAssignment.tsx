'use client'

import { useState } from 'react'
import { assignCase } from '@/src/server/cases'
import { User, Case } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  container: {
    marginTop: spacing[4],
  },
  card: {
    marginTop: spacing[4],
    backgroundColor: colors.white,
    padding: spacing[4],
    borderRadius: radii.lg,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing[4],
  },
})

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
      await assignCase({
        data: {
          caseId: case_.id,
          caseManagerId: selectedCaseManager || undefined,
          neutralId: selectedNeutral || undefined,
        },
      })

      toast.success('Case assigned successfully')
      setIsAssigning(false)
      onAssign()
    } catch (error) {
      console.error('Error assigning case:', error)
      toast.error('Failed to assign case')
    }
  }

  return (
    <div {...stylex.props(styles.container)}>
      <Button 
        variant="outline" 
        onClick={() => setIsAssigning(!isAssigning)}
      >
        Assign Case
      </Button>

      {isAssigning && (
        <div {...stylex.props(styles.card)}>
          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="case-manager-select">Case Manager</Label>
            <Select
              value={selectedCaseManager}
              onValueChange={setSelectedCaseManager}
            >
              <SelectTrigger style={{ width: '100%' }}>
                <SelectValue placeholder="Select Case Manager" />
              </SelectTrigger>
              <SelectContent>
                {caseManagers.map((cm) => (
                  <SelectItem key={cm.id} value={cm.id}>
                    {cm.name} ({cm.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="neutral-select">Neutral</Label>
            <Select
              value={selectedNeutral}
              onValueChange={setSelectedNeutral}
            >
              <SelectTrigger style={{ width: '100%' }}>
                <SelectValue placeholder="Select Neutral" />
              </SelectTrigger>
              <SelectContent>
                {neutrals.map((n) => (
                  <SelectItem key={n.id} value={n.id}>
                    {n.name} ({n.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div {...stylex.props(styles.actionsRow)}>
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
