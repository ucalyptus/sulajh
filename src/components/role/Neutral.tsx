'use client'

import { useCompletion } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { CaseState } from '@/src/types'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  wrapper: {
    maxWidth: '42rem',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  headerBox: {
    marginBottom: spacing[6],
  },
  heading: {
    fontSize: '1.125rem',
    fontWeight: 600,
    margin: 0,
  },
  caseIdText: {
    marginBottom: spacing[2],
  },
  card: {
    marginBottom: spacing[4],
    padding: spacing[4],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.gray50,
  },
  cardTitle: {
    fontWeight: 500,
    marginBottom: spacing[2],
    margin: 0,
  },
  actionsGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  decisionBox: {
    marginTop: spacing[6],
    padding: spacing[4],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.gray50,
  },
  preWrap: {
    whiteSpace: 'pre-wrap',
  },
})

export function Neutral() {
  const router = useRouter()
  const searchParams = useSearch({ strict: false }) as Record<string, string>
  const caseId = searchParams['caseId'] || null
  const [caseData, setCaseData] = useState<CaseState | null>(null)
  const [decision, setDecision] = useState('')
  
  const { complete, completion } = useCompletion({
    api: '/api/neutral',
    onFinish: (result) => {
      setDecision(result)
    },
  })

  useEffect(() => {
    if (caseId) {
      const mockCaseData: CaseState = {
        id: caseId,
        status: 'respondent_submitted',
        claimantRequest: localStorage.getItem(`case_${caseId}_claim`) || '',
        respondentResponse: localStorage.getItem(`case_${caseId}_response`) || '',
        neutralAssigned: true
      }
      setCaseData(mockCaseData)
    }
  }, [caseId])

  const handleConductProceedings = async () => {
    if (!caseId || !caseData) return
    
    await complete(JSON.stringify(caseData))
    console.log('Proceedings completed for case:', caseId)
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      {caseId && caseData ? (
        <>
          <div {...stylex.props(styles.headerBox)}>
            <h2 {...stylex.props(styles.heading)}>Case Proceedings</h2>
            <p {...stylex.props(styles.caseIdText)}>Case ID: {caseId}</p>
            
            <div {...stylex.props(styles.card)}>
              <h3 {...stylex.props(styles.cardTitle)}>Claim:</h3>
              <p>{caseData.claimantRequest}</p>
            </div>
            
            <div {...stylex.props(styles.card)}>
              <h3 {...stylex.props(styles.cardTitle)}>Response:</h3>
              <p>{caseData.respondentResponse}</p>
            </div>
          </div>

          <div {...stylex.props(styles.actionsGroup)}>
            <Button 
              onClick={handleConductProceedings}
              disabled={!!completion}
            >
              Conduct Proceedings
            </Button>

            {completion && (
              <div {...stylex.props(styles.decisionBox)}>
                <h3 {...stylex.props(styles.cardTitle)}>Decision:</h3>
                <div {...stylex.props(styles.preWrap)}>{completion}</div>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading case data...</p>
      )}
    </div>
  )
}
