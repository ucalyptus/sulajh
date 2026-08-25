import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import StatusBadge from '@/components/StatusBadge'
import { formatDate } from '@/lib/utils'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  container: {
    maxWidth: '56rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[8],
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: spacing[6],
    margin: 0,
  },
  emptyCard: {
    padding: spacing[8],
    textAlign: 'center',
  },
  emptyText: {
    color: colors.mutedForeground,
    margin: 0,
  },
  grid: {
    display: 'grid',
    gap: spacing[3],
  },
  link: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
  },
  card: {
    padding: spacing[5],
    transitionProperty: 'box-shadow',
    transitionDuration: '0.2s',
    ':hover': {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  },
  cardInner: {
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
  textWrapper: {
    minWidth: 0,
  },
  title: {
    fontWeight: 500,
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    marginTop: spacing[0.5],
    margin: 0,
  },
})

const getUserCases = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session) throw redirect({ to: '/auth/signin' })

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  if (!user) throw redirect({ to: '/auth/signin' })

  if (user.role === 'REGISTRAR') {
    return prisma.case.findMany({
      include: {
        claimant: { select: { email: true } },
        respondent: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  return prisma.case.findMany({
    where: {
      OR: [
        { claimantId: user.id },
        { respondentId: user.id },
        { caseManagerId: user.id },
        { neutralId: user.id },
      ],
    },
    include: {
      claimant: { select: { email: true } },
      respondent: { select: { email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
})

export const Route = createFileRoute('/cases/')({
  component: CasesPage,
  loader: () => getUserCases(),
  head: () => ({ meta: [{ title: 'Cases | Sulajh' }] }),
})

function CasesPage() {
  const cases = Route.useLoaderData()

  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.heading)}>All Cases</h1>
      {cases.length === 0 ? (
        <Card style={styles.emptyCard}>
          <p {...stylex.props(styles.emptyText)}>No cases found.</p>
        </Card>
      ) : (
        <div {...stylex.props(styles.grid)}>
          {cases.map((case_) => (
            <Link key={case_.id} to="/cases/$id" params={{ id: case_.id }} {...stylex.props(styles.link)}>
              <Card style={styles.card}>
                <div {...stylex.props(styles.cardInner)}>
                  <div {...stylex.props(styles.textWrapper)}>
                    <h3 {...stylex.props(styles.title)}>
                      {case_.claimantRequest?.substring(0, 100) || 'No details'}
                    </h3>
                    <p {...stylex.props(styles.meta)}>
                      {case_.claimant?.email} → {case_.respondent?.email || 'Pending'} · {formatDate(case_.createdAt)}
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
