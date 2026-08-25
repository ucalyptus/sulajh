import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

export const statusStyles = stylex.create({
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingLeft: spacing[2.5],
    paddingRight: spacing[2.5],
    paddingTop: spacing[0.5],
    paddingBottom: spacing[0.5],
    borderRadius: radii.full,
    fontSize: '0.75rem',
    fontWeight: 500,
    borderWidth: '1px',
    borderStyle: 'solid',
    boxSizing: 'border-box',
  },
  DRAFT: {
    backgroundColor: colors.gray100,
    color: colors.gray700,
    borderColor: colors.gray200,
  },
  PENDING_RESPONDENT: {
    backgroundColor: colors.amber50,
    color: colors.amber700,
    borderColor: colors.amber200,
  },
  ASSIGNED_TO_MANAGER: {
    backgroundColor: colors.blue50,
    color: colors.blue700,
    borderColor: colors.blue100,
  },
  PENDING_PREPROCEEDING_CLAIMANT: {
    backgroundColor: colors.orange50,
    color: colors.orange700,
    borderColor: colors.orange200,
  },
  PENDING_PREPROCEEDING_RESPONDENT: {
    backgroundColor: colors.orange50,
    color: colors.orange700,
    borderColor: colors.orange200,
  },
  PENDING_NEUTRAL: {
    backgroundColor: colors.purple50,
    color: colors.purple700,
    borderColor: colors.purple200,
  },
  NEUTRAL_ASSIGNED: {
    backgroundColor: colors.indigo50,
    color: colors.indigo700,
    borderColor: colors.indigo200,
  },
  IN_PROGRESS: {
    backgroundColor: colors.sky50,
    color: colors.sky700,
    borderColor: colors.sky200,
  },
  DECISION_ISSUED: {
    backgroundColor: colors.emerald50,
    color: colors.emerald700,
    borderColor: colors.emerald200,
  },
  CLOSED: {
    backgroundColor: colors.gray100,
    color: colors.gray600,
    borderColor: colors.gray200,
  },
  APPEALED: {
    backgroundColor: colors.red50,
    color: colors.red700,
    borderColor: colors.red200,
  },
})

const labels: Record<string, string> = {
  DRAFT: 'Draft',
  PENDING_RESPONDENT: 'Awaiting Respondent',
  ASSIGNED_TO_MANAGER: 'Assigned to Manager',
  PENDING_PREPROCEEDING_CLAIMANT: 'Pre-proceeding (Claimant)',
  PENDING_PREPROCEEDING_RESPONDENT: 'Pre-proceeding (Respondent)',
  PENDING_NEUTRAL: 'Awaiting Neutral',
  NEUTRAL_ASSIGNED: 'Neutral Assigned',
  IN_PROGRESS: 'In Progress',
  DECISION_ISSUED: 'Decision Issued',
  CLOSED: 'Closed',
  APPEALED: 'Appealed',
}

type StatusKey = keyof typeof statusStyles

export default function StatusBadge({ status }: { status: string }) {
  const label = labels[status] ?? status
  const key = status in statusStyles ? (status as StatusKey) : 'DRAFT'
  const themeStyle = statusStyles[key]

  return (
    <span
      role="status"
      {...stylex.props(statusStyles.badge, themeStyle)}
    >
      {label}
    </span>
  )
}
