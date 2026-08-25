import { createFileRoute } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  wrapper: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.875rem',
    fontWeight: 700,
    marginBottom: spacing[4],
    margin: 0,
  },
  subtitle: {
    color: colors.mutedForeground,
    margin: 0,
  },
})

export const Route = createFileRoute('/unauthorized')({
  component: UnauthorizedPage,
})

function UnauthorizedPage() {
  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.content)}>
        <h1 {...stylex.props(styles.heading)}>Unauthorized</h1>
        <p {...stylex.props(styles.subtitle)}>You do not have permission to access this page.</p>
      </div>
    </div>
  )
}
