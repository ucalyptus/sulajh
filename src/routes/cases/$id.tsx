import { createFileRoute, redirect, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { prisma } from '@/lib/prisma'
import { CaseJudgment } from '@/components/case-judgment'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  container: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: spacing[8],
  },
  wrapper: {
    maxWidth: '48rem',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: spacing[6],
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[6],
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
  },
  statusBadge: {
    display: 'inline-block',
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
    paddingTop: spacing[1],
    paddingBottom: spacing[1],
    fontSize: '0.875rem',
    borderRadius: radii.full,
    backgroundColor: colors.blue100,
    color: colors.blue700,
    fontWeight: 500,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: spacing[2],
    margin: 0,
  },
  subTitle: {
    fontWeight: 600,
    marginBottom: spacing[2],
    margin: 0,
  },
  preText: {
    whiteSpace: 'pre-wrap',
    color: colors.gray700,
    margin: 0,
  },
  dl: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
    fontSize: '0.875rem',
    margin: 0,
  },
  dt: {
    color: colors.gray500,
  },
  dd: {
    margin: 0,
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 768px)': 'repeat(2, 1fr)',
    },
    gap: spacing[6],
  },
})

const getCaseData = createServerFn({ method: 'GET' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/auth/signin' })

    const case_ = await prisma.case.findUnique({
      where: { id: data.id },
      include: {
        claimant: true,
        respondent: true,
        caseManager: true,
        neutral: true,
        invitations: true,
      },
    })

    if (!case_) throw notFound()

    const hasAccess =
      session.role === 'REGISTRAR' ||
      (session.role === 'CASE_MANAGER' && case_.caseManagerId === session.id) ||
      (session.role === 'NEUTRAL' && case_.neutralId === session.id) ||
      case_.claimantId === session.id ||
      case_.respondentId === session.id

    if (!hasAccess) throw notFound()

    let caseManagers: any[] = []
    let neutrals: any[] = []

    if (session.role === 'REGISTRAR') {
      caseManagers = await prisma.user.findMany({ where: { role: 'CASE_MANAGER' } })
      neutrals = await prisma.user.findMany({ where: { role: 'NEUTRAL' } })
    }

    return { case_, session, caseManagers, neutrals }
  })

export const Route = createFileRoute('/cases/$id')({
  component: CasePage,
  loader: ({ params }) => getCaseData({ data: { id: params.id } }),
  head: ({ loaderData }) => ({
    meta: [{ title: `Case #${loaderData?.case_?.id || ''} | Sulajh` }],
  }),
})

function CasePage() {
  const { case_ } = Route.useLoaderData()

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.wrapper)}>
        <div {...stylex.props(styles.card)}>
          <div {...stylex.props(styles.header)}>
            <h1 {...stylex.props(styles.title)}>Case #{case_.id}</h1>
            <span {...stylex.props(styles.statusBadge)}>
              {case_.status}
            </span>
          </div>

          <div {...stylex.props(styles.content)}>
            <div>
              <h2 {...stylex.props(styles.sectionTitle)}>Claim Details</h2>
              <p {...stylex.props(styles.preText)}>
                {case_.claimantRequest || 'No details provided'}
              </p>
            </div>

            {case_.respondentResponse && (
              <div>
                <h2 {...stylex.props(styles.sectionTitle)}>Response</h2>
                <p {...stylex.props(styles.preText)}>
                  {case_.respondentResponse}
                </p>
              </div>
            )}

            {case_.finalDecision && (
              <CaseJudgment judgment={case_.finalDecision} />
            )}

            <div>
              <h3 {...stylex.props(styles.subTitle)}>Case Information</h3>
              <dl {...stylex.props(styles.dl)}>
                <div>
                  <dt {...stylex.props(styles.dt)}>Claimant</dt>
                  <dd {...stylex.props(styles.dd)}>{case_.claimant.email}</dd>
                </div>
                <div>
                  <dt {...stylex.props(styles.dt)}>Respondent</dt>
                  <dd {...stylex.props(styles.dd)}>
                    {case_.respondent?.email ||
                      case_.invitations[0]?.email ||
                      'Not assigned'}
                  </dd>
                </div>
              </dl>
            </div>

            <div {...stylex.props(styles.grid)}>
              <div>
                <h3 {...stylex.props(styles.subTitle)}>Case Officials</h3>
                <dl {...stylex.props(styles.dl)}>
                  <div>
                    <dt {...stylex.props(styles.dt)}>Case Manager</dt>
                    <dd {...stylex.props(styles.dd)}>{case_.caseManager?.name || 'Not assigned'}</dd>
                  </div>
                  <div>
                    <dt {...stylex.props(styles.dt)}>Neutral</dt>
                    <dd {...stylex.props(styles.dd)}>{case_.neutral?.name || 'Not assigned'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
