'use client'

import { Link } from '@tanstack/react-router'
import { Case, UserRole } from '@prisma/client'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
  },
  card: {
    backgroundColor: colors.white,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: radii.lg,
    padding: spacing[6],
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: 500,
    margin: 0,
  },
  subtitle: {
    marginTop: spacing[1],
    fontSize: '0.875rem',
    color: colors.gray500,
    margin: 0,
  },
  button: {
    backgroundColor: colors.blue500,
    color: colors.white,
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    borderRadius: radii.md,
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    ':hover': {
      backgroundColor: colors.blue600,
    },
  },
  empty: {
    color: colors.gray500,
    textAlign: 'center',
    paddingTop: spacing[8],
    paddingBottom: spacing[8],
  },
})

interface CaseListProps {
  cases: Case[]
  userRole: UserRole
}

export function CaseList({ cases }: CaseListProps) {
  return (
    <div {...stylex.props(styles.container)}>
      {cases.map((case_) => (
        <div 
          key={case_.id} 
          {...stylex.props(styles.card)}
        >
          <div {...stylex.props(styles.row)}>
            <div>
              <h3 {...stylex.props(styles.title)}>
                Case #{case_.id}
              </h3>
              <p {...stylex.props(styles.subtitle)}>
                Status: {case_.status}
              </p>
            </div>
            <Link
              to="/cases/$id"
              params={{ id: case_.id }}
              {...stylex.props(styles.button)}
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
      
      {cases.length === 0 && (
        <p {...stylex.props(styles.empty)}>
          No cases found
        </p>
      )}
    </div>
  )
}
