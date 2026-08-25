'use client'

import { aiNeutralDecision } from '@/src/server/ai'
import { getCase, issueJudgment } from '@/src/server/cases'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
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
  preText: {
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  actionsGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  draftBox: {
    marginTop: spacing[6],
    padding: spacing[4],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.gray50,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  errorText: {
    color: colors.red500,
    fontSize: '0.875rem',
  },
})

interface CaseData {
  id: string
  claimantRequest: string | null
  respondentResponse: string | null
}

export function Neutral() {
  const router = useRouter()
  const searchParams = useSearch({ strict: false }) as Record<string, string>
  const caseId = searchParams['caseId'] || null
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isIssuing, setIsIssuing] = useState(false)

  useEffect(() => {
    if (!caseId) return
    // Load case record from the database (authorized via getCase).
    getCase({ data: { id: caseId } })
      .then((case_) => {
        if (case_) setCaseData(case_)
      })
      .catch((err) => {
        console.error('Error loading case:', err)
        setError('Failed to load case data')
      })
  }, [caseId])

  const handleConductProceedings = async () => {
    if (!caseId || !caseData) return
    setIsGenerating(true)
    setError('')

    try {
      // Generate a reviewable draft; nothing is persisted yet.
      const generated = await aiNeutralDecision({ data: { caseId } })
      setDraft(generated)
    } catch (err) {
      console.error('Error conducting proceedings:', err)
      setError(err instanceof Error ? err.message : 'Proceedings failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleIssueDecision = async () => {
    if (!caseId || !draft.trim()) return
    setIsIssuing(true)
    setError('')

    try {
      await issueJudgment({ data: { caseId, decision: draft } })
      router.navigate({ to: '/cases/$id', params: { id: caseId } })
    } catch (err) {
      console.error('Error issuing decision:', err)
      setError(err instanceof Error ? err.message : 'Failed to issue decision')
    } finally {
      setIsIssuing(false)
    }
  }

  if (error && !caseData) {
    return (
      <div {...stylex.props(styles.wrapper)}>
        <p {...stylex.props(styles.errorText)}>{error}</p>
      </div>
    )
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
              <p {...stylex.props(styles.preText)}>{caseData.claimantRequest}</p>
            </div>

            <div {...stylex.props(styles.card)}>
              <h3 {...stylex.props(styles.cardTitle)}>Response:</h3>
              <p {...stylex.props(styles.preText)}>{caseData.respondentResponse}</p>
            </div>
          </div>

          <div {...stylex.props(styles.actionsGroup)}>
            {!draft && (
              <Button 
                onClick={handleConductProceedings}
                disabled={isGenerating}
              >
                {isGenerating ? 'Conducting...' : 'Conduct Proceedings'}
              </Button>
            )}

            {error && <p {...stylex.props(styles.errorText)}>{error}</p>}

            {draft && (
              <div {...stylex.props(styles.draftBox)}>
                <h3 {...stylex.props(styles.cardTitle)}>Decision Draft (review & edit):</h3>
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={12}
                />
                <Button onClick={handleIssueDecision} disabled={isIssuing || !draft.trim()}>
                  {isIssuing ? 'Issuing...' : 'Issue Decision'}
                </Button>
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
