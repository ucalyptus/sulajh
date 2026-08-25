'use client'

import { User, Case } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  card: {
    backgroundColor: colors.white,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: radii.lg,
    padding: spacing[6],
  },
  header: {
    marginBottom: spacing[6],
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: spacing[2],
    margin: 0,
  },
  statusText: {
    color: colors.gray600,
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 768px)': 'repeat(2, 1fr)',
    },
    gap: spacing[6],
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: spacing[3],
    margin: 0,
  },
  subTitle: {
    fontWeight: 500,
    marginBottom: spacing[2],
    margin: 0,
  },
  detailsBox: {
    marginTop: spacing[4],
  },
  preText: {
    color: colors.gray700,
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  mutedText: {
    color: colors.gray500,
    margin: 0,
  },
  divider: {
    marginTop: spacing[6],
    paddingTop: spacing[6],
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
  },
  meta: {
    marginTop: spacing[6],
    paddingTop: spacing[6],
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    fontSize: '0.875rem',
    color: colors.gray500,
  },
})

type CaseWithParties = Case & {
  claimant: User
  respondent: User | null
  caseManager: User | null
  neutral: User | null
}

interface CaseDetailsProps {
  case_: CaseWithParties
  userRole: string
}

export function CaseDetails({ case_ }: CaseDetailsProps) {
  return (
    <div {...stylex.props(styles.card)}>
      <div {...stylex.props(styles.header)}>
        <h1 {...stylex.props(styles.title)}>Case #{case_.id}</h1>
        <p {...stylex.props(styles.statusText)}>Status: {case_.status}</p>
      </div>

      <div {...stylex.props(styles.grid)}>
        <div>
          <h2 {...stylex.props(styles.sectionTitle)}>Claimant</h2>
          <p>{case_.claimant.name || case_.claimant.email}</p>
          
          <div {...stylex.props(styles.detailsBox)}>
            <h3 {...stylex.props(styles.subTitle)}>Claim Details</h3>
            <p {...stylex.props(styles.preText)}>
              {case_.claimantRequest}
            </p>
          </div>
        </div>

        <div>
          <h2 {...stylex.props(styles.sectionTitle)}>Respondent</h2>
          {case_.respondent ? (
            <>
              <p>{case_.respondent.name || case_.respondent.email}</p>
              {case_.respondentResponse && (
                <div {...stylex.props(styles.detailsBox)}>
                  <h3 {...stylex.props(styles.subTitle)}>Response</h3>
                  <p {...stylex.props(styles.preText)}>
                    {case_.respondentResponse}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p {...stylex.props(styles.mutedText)}>Pending respondent</p>
          )}
        </div>
      </div>

      <div {...stylex.props(styles.divider)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Case Management</h2>
        <div {...stylex.props(styles.grid)}>
          <div>
            <h3 {...stylex.props(styles.subTitle)}>Case Manager</h3>
            {case_.caseManager ? (
              <p>{case_.caseManager.name || case_.caseManager.email}</p>
            ) : (
              <p {...stylex.props(styles.mutedText)}>Not yet assigned</p>
            )}
          </div>
          
          <div>
            <h3 {...stylex.props(styles.subTitle)}>Neutral</h3>
            {case_.neutral ? (
              <p>{case_.neutral.name || case_.neutral.email}</p>
            ) : (
              <p {...stylex.props(styles.mutedText)}>Not yet assigned</p>
            )}
          </div>
        </div>
      </div>

      <div {...stylex.props(styles.meta)}>
        <p>Created: {formatDate(case_.createdAt)}</p>
        <p>Last Updated: {formatDate(case_.updatedAt)}</p>
      </div>
    </div>
  )
}
