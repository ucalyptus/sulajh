import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/StatusBadge'
import { formatDate } from '@/lib/utils'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  container: {
    maxWidth: '64rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[8],
  },
  headerRow: {
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 640px)': 'row',
    },
    alignItems: {
      default: 'flex-start',
      '@media (min-width: 640px)': 'center',
    },
    justifyContent: 'space-between',
    gap: spacing[4],
    marginBottom: spacing[8],
  },
  welcomeTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
  },
  userMeta: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    margin: 0,
    marginTop: spacing[0.5],
  },
  capitalizeText: {
    textTransform: 'capitalize',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 640px)': 'repeat(3, 1fr)',
    },
    gap: spacing[4],
    marginBottom: spacing[8],
  },
  statCard: {
    padding: spacing[5],
  },
  statLabel: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.mutedForeground,
    margin: 0,
  },
  statValue: {
    fontSize: '1.875rem',
    fontWeight: 700,
    marginTop: spacing[1],
    margin: 0,
  },
  openValue: {
    color: colors.primary,
  },
  resolvedValue: {
    color: colors.emerald700,
  },
  sectionHeading: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: spacing[4],
    margin: 0,
  },
  emptyCard: {
    padding: spacing[8],
    textAlign: 'center',
  },
  emptyText: {
    color: colors.mutedForeground,
    marginBottom: spacing[4],
    margin: 0,
  },
  casesGrid: {
    display: 'grid',
    gap: spacing[3],
  },
  caseLink: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
  },
  caseCard: {
    padding: spacing[5],
    transitionProperty: 'box-shadow',
    transitionDuration: '0.2s',
    ':hover': {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  },
  caseCardInner: {
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 640px)': 'row',
    },
    alignItems: {
      default: 'flex-start',
      '@media (min-width: 640px)': 'center',
    },
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  caseTextWrapper: {
    minWidth: 0,
  },
  caseTitle: {
    fontWeight: 500,
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  caseMeta: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    marginTop: spacing[0.5],
    margin: 0,
  },
})

const getDashboardData = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, role: true, createdAt: true },
  })

  if (!user) throw new Error('User not found')

  const cases = await prisma.case.findMany({
    where: {
      OR: [
        { claimantId: session.id },
        { respondentId: session.id },
        { caseManagerId: session.id },
        { neutralId: session.id },
      ],
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      claimantRequest: true,
      createdAt: true,
      respondent: { select: { email: true } },
    },
  })

  return { user, cases }
})

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
  loader: () => getDashboardData(),
  head: () => ({ meta: [{ title: 'Dashboard | Sulajh' }] }),
})

function DashboardPage() {
  const { user, cases } = Route.useLoaderData()

  const openCases = cases.filter((c) => !['CLOSED', 'DECISION_ISSUED'].includes(c.status))
  const resolvedCases = cases.filter((c) => ['CLOSED', 'DECISION_ISSUED'].includes(c.status))

  const getEmptyStateMessage = (role: string) => {
    switch (role) {
      case 'CLAIMANT':
        return "You haven't filed any claims yet."
      case 'RESPONDENT':
        return 'No cases filed against you yet.'
      case 'CASE_MANAGER':
        return 'No cases assigned to you for management.'
      case 'NEUTRAL':
        return 'No cases assigned to you for neutral review.'
      default:
        return 'No cases found.'
    }
  }

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.headerRow)}>
        <div>
          <h1 {...stylex.props(styles.welcomeTitle)}>Welcome back, {user.name || 'User'}</h1>
          <p {...stylex.props(styles.userMeta)}>
            {user.email} · <span {...stylex.props(styles.capitalizeText)}>{user.role.toLowerCase().replace('_', ' ')}</span> · Member since {formatDate(user.createdAt)}
          </p>
        </div>
        {(user.role === 'CLAIMANT' || user.role === 'REGISTRAR') && (
          <Link to="/cases/new">
            <Button>+ File New Case</Button>
          </Link>
        )}
      </div>

      <div {...stylex.props(styles.statsGrid)}>
        <Card style={styles.statCard}>
          <p {...stylex.props(styles.statLabel)}>Total Cases</p>
          <p {...stylex.props(styles.statValue)}>{cases.length}</p>
        </Card>
        <Card style={styles.statCard}>
          <p {...stylex.props(styles.statLabel)}>Open</p>
          <p {...stylex.props(styles.statValue, styles.openValue)}>{openCases.length}</p>
        </Card>
        <Card style={styles.statCard}>
          <p {...stylex.props(styles.statLabel)}>Resolved</p>
          <p {...stylex.props(styles.statValue, styles.resolvedValue)}>{resolvedCases.length}</p>
        </Card>
      </div>

      <h2 {...stylex.props(styles.sectionHeading)}>Your Cases</h2>
      {cases.length === 0 ? (
        <Card style={styles.emptyCard}>
          <p {...stylex.props(styles.emptyText)}>{getEmptyStateMessage(user.role)}</p>
          {(user.role === 'CLAIMANT' || user.role === 'REGISTRAR') && (
            <Link to="/cases/new">
              <Button variant="outline">File a Claim</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div {...stylex.props(styles.casesGrid)}>
          {cases.map((case_) => (
            <Link key={case_.id} to="/cases/$id" params={{ id: case_.id }} {...stylex.props(styles.caseLink)}>
              <Card style={styles.caseCard}>
                <div {...stylex.props(styles.caseCardInner)}>
                  <div {...stylex.props(styles.caseTextWrapper)}>
                    <h3 {...stylex.props(styles.caseTitle)}>
                      {case_.claimantRequest
                        ? case_.claimantRequest.substring(0, 100)
                        : 'No details provided'}
                    </h3>
                    <p {...stylex.props(styles.caseMeta)}>
                      Respondent: {case_.respondent?.email || 'Pending'} · {formatDate(case_.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={case_.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
