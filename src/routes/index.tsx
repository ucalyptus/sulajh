import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  page: {
    backgroundColor: colors.background,
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
  },
  heroGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom right, rgba(37, 99, 235, 0.05), transparent, rgba(37, 99, 235, 0.1))',
  },
  heroContainer: {
    position: 'relative',
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: {
      default: spacing[20],
      '@media (min-width: 640px)': spacing[28],
    },
    paddingBottom: {
      default: spacing[20],
      '@media (min-width: 640px)': spacing[28],
    },
  },
  heroContent: {
    textAlign: 'center',
    maxWidth: '48rem',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heroTitle: {
    fontSize: {
      default: '2.25rem',
      '@media (min-width: 640px)': '3rem',
      '@media (min-width: 1024px)': '3.75rem',
    },
    fontWeight: 700,
    letterSpacing: '-0.025em',
    color: colors.foreground,
    marginBottom: spacing[6],
    margin: 0,
  },
  titleHighlight: {
    color: colors.primary,
  },
  heroSubtitle: {
    fontSize: {
      default: '1.125rem',
      '@media (min-width: 640px)': '1.25rem',
    },
    color: colors.mutedForeground,
    marginBottom: spacing[8],
    maxWidth: '42rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: 1.6,
  },
  heroActions: {
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 640px)': 'row',
    },
    gap: spacing[4],
    justifyContent: 'center',
  },
  ctaButton: {
    width: {
      default: '100%',
      '@media (min-width: 640px)': 'auto',
    },
    fontSize: '1rem',
    paddingLeft: spacing[8],
    paddingRight: spacing[8],
  },
  section: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: {
      default: spacing[16],
      '@media (min-width: 640px)': spacing[20],
    },
    paddingBottom: {
      default: spacing[16],
      '@media (min-width: 640px)': spacing[20],
    },
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: spacing[12],
  },
  sectionTitle: {
    fontSize: '1.875rem',
    fontWeight: 700,
    color: colors.foreground,
    marginBottom: spacing[3],
    margin: 0,
  },
  sectionSubtitle: {
    color: colors.mutedForeground,
    maxWidth: '36rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    margin: 0,
  },
  gridFeatures: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 768px)': 'repeat(2, 1fr)',
      '@media (min-width: 1024px)': 'repeat(3, 1fr)',
    },
    gap: spacing[6],
  },
  featureCard: {
    padding: spacing[6],
    transitionProperty: 'box-shadow',
    transitionDuration: '0.2s',
    ':hover': {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  },
  featureIcon: {
    fontSize: '1.875rem',
    marginBottom: spacing[3],
  },
  featureTitle: {
    fontWeight: 600,
    fontSize: '1.125rem',
    marginBottom: spacing[1],
    margin: 0,
  },
  featureDesc: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    margin: 0,
    lineHeight: 1.5,
  },
  howSection: {
    backgroundColor: 'rgba(243, 244, 246, 0.4)',
    paddingTop: {
      default: spacing[16],
      '@media (min-width: 640px)': spacing[20],
    },
    paddingBottom: {
      default: spacing[16],
      '@media (min-width: 640px)': spacing[20],
    },
  },
  howContainer: {
    maxWidth: '64rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
  },
  gridSteps: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 640px)': 'repeat(2, 1fr)',
      '@media (min-width: 1024px)': 'repeat(4, 1fr)',
    },
    gap: spacing[8],
  },
  stepCard: {
    textAlign: 'center',
  },
  stepBadge: {
    width: '3rem',
    height: '3rem',
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.125rem',
    fontWeight: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: spacing[4],
  },
  stepTitle: {
    fontWeight: 600,
    marginBottom: spacing[1],
    margin: 0,
  },
  ctaSection: {
    maxWidth: '56rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: {
      default: spacing[16],
      '@media (min-width: 640px)': spacing[20],
    },
    paddingBottom: {
      default: spacing[16],
      '@media (min-width: 640px)': spacing[20],
    },
    textAlign: 'center',
  },
})

const getHomeData = createServerFn({ method: 'GET' }).handler(async () => {
  return await getSession()
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => getHomeData(),
})

const features = [
  { icon: '⚖️', title: 'Fair & Impartial', description: 'AI-assisted mediation ensures both parties are heard equally and objectively.' },
  { icon: '⚡', title: 'Fast Resolution', description: 'Resolve disputes in days, not months. No courtroom delays or lengthy procedures.' },
  { icon: '💰', title: 'Affordable', description: 'A fraction of the cost of traditional legal proceedings. Accessible to everyone.' },
  { icon: '🔒', title: 'Secure & Private', description: 'End-to-end encryption. Your case details remain confidential at every step.' },
  { icon: '🤖', title: 'AI-Powered', description: 'Intelligent analysis helps identify fair solutions and common ground between parties.' },
  { icon: '📱', title: 'Fully Online', description: 'File claims, respond, negotiate, and settle — all from your browser. No travel needed.' },
]

const steps = [
  { step: '1', title: 'File a Claim', description: 'Describe your dispute and upload supporting evidence.' },
  { step: '2', title: 'Respondent Notified', description: 'The other party is invited to respond to the claim.' },
  { step: '3', title: 'Mediation & Review', description: 'A case manager and neutral review both sides with AI assistance.' },
  { step: '4', title: 'Resolution', description: 'Reach a fair settlement or receive a binding decision.' },
]

function Home() {
  const session = Route.useLoaderData()

  return (
    <div {...stylex.props(styles.page)}>
      {/* Hero Section */}
      <section {...stylex.props(styles.hero)}>
        <div {...stylex.props(styles.heroGradient)} />
        <div {...stylex.props(styles.heroContainer)}>
          <div {...stylex.props(styles.heroContent)}>
            <h1 {...stylex.props(styles.heroTitle)}>
              Resolve Disputes
              <span {...stylex.props(styles.titleHighlight)}> Fairly & Fast</span>
            </h1>
            <p {...stylex.props(styles.heroSubtitle)}>
              Sulajh is an AI-powered online dispute resolution platform.
              File a claim, negotiate, and reach a fair settlement — all online,
              in days instead of months.
            </p>
            <div {...stylex.props(styles.heroActions)}>
              <Link to={session ? '/cases/new' : '/auth/signup'}>
                <Button size="lg" style={styles.ctaButton}>
                  {session ? 'File a Claim' : 'Get Started Free'}
                </Button>
              </Link>
              {session ? (
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" style={styles.ctaButton}>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth/signin">
                  <Button size="lg" variant="outline" style={styles.ctaButton}>
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section {...stylex.props(styles.section)}>
        <div {...stylex.props(styles.sectionHeader)}>
          <h2 {...stylex.props(styles.sectionTitle)}>Why Choose Sulajh?</h2>
          <p {...stylex.props(styles.sectionSubtitle)}>
            A modern approach to dispute resolution that saves time, money, and stress.
          </p>
        </div>
        <div {...stylex.props(styles.gridFeatures)}>
          {features.map((f) => (
            <Card key={f.title} style={styles.featureCard}>
              <div {...stylex.props(styles.featureIcon)}>{f.icon}</div>
              <h3 {...stylex.props(styles.featureTitle)}>{f.title}</h3>
              <p {...stylex.props(styles.featureDesc)}>{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section {...stylex.props(styles.howSection)}>
        <div {...stylex.props(styles.howContainer)}>
          <div {...stylex.props(styles.sectionHeader)}>
            <h2 {...stylex.props(styles.sectionTitle)}>How It Works</h2>
            <p {...stylex.props(styles.sectionSubtitle)}>Four simple steps to resolve your dispute.</p>
          </div>
          <div {...stylex.props(styles.gridSteps)}>
            {steps.map((s) => (
              <div key={s.step} {...stylex.props(styles.stepCard)}>
                <div {...stylex.props(styles.stepBadge)}>
                  {s.step}
                </div>
                <h3 {...stylex.props(styles.stepTitle)}>{s.title}</h3>
                <p {...stylex.props(styles.featureDesc)}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section {...stylex.props(styles.ctaSection)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Ready to Resolve Your Dispute?</h2>
        <p {...stylex.props(styles.sectionSubtitle)}>
          Join thousands using Sulajh for faster, fairer outcomes. No lawyers needed.
        </p>
        <Link to={session ? '/cases/new' : '/auth/signup'}>
          <Button size="lg" style={styles.ctaButton}>
            {session ? 'File a Claim Now' : 'Create Your Free Account'}
          </Button>
        </Link>
      </section>
    </div>
  )
}
