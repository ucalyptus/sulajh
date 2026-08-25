import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import SignUpForm from '@/components/SignUpForm'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@/styles/tokens.stylex'

export interface InvitationData {
  email: string
  token: string
}

const getInvitationData = createServerFn({ method: 'GET' })
  .validator((d: { invitation?: string }) => d)
  .handler(async ({ data }): Promise<InvitationData | null> => {
    if (!data.invitation) return null
    const inv = await prisma.caseInvitation.findUnique({
      where: { token: data.invitation },
      select: { email: true },
    })
    return inv ? { email: inv.email, token: data.invitation } : null
})

const styles = stylex.create({
  wrapper: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  },
  card: {
    maxWidth: '28rem',
    width: '100%',
    padding: spacing[8],
  },
  header: {
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    marginTop: spacing[1],
    margin: 0,
  },
  footerText: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    marginTop: spacing[6],
    margin: 0,
  },
  link: {
    color: colors.primary,
    fontWeight: 500,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
})

export const Route = createFileRoute('/auth/signup')({
  validateSearch: (search: Record<string, unknown>) => ({
    invitation: (search.invitation as string) || undefined,
  }),
  component: SignUpPage,
})

function SignUpPage() {
  const { invitation } = Route.useSearch()
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null)

  useEffect(() => {
    getInvitationData({ data: { invitation } }).then(setInvitationData)
  }, [invitation])
  return (
    <div {...stylex.props(styles.wrapper)}>
      <Card style={styles.card}>
        <div {...stylex.props(styles.header)}>
          <h1 {...stylex.props(styles.title)}>
            {invitationData ? 'Complete Your Registration' : 'Create an Account'}
          </h1>
          <p {...stylex.props(styles.subtitle)}>
            {invitationData
              ? "You've been invited to respond to a case"
              : 'Start resolving disputes with Sulajh'}
          </p>
        </div>
        <SignUpForm invitationData={invitationData} />
        {!invitationData && (
          <p {...stylex.props(styles.footerText)}>
            Already have an account?{' '}
            <Link to="/auth/signin" {...stylex.props(styles.link)}>
              Sign in
            </Link>
          </p>
        )}
      </Card>
    </div>
  )
}
