import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  wrapper: {
    minHeight: '100vh',
    backgroundColor: colors.gray50,
  },
  container: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[8],
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: colors.gray900,
    marginBottom: spacing[8],
    margin: 0,
  },
})

interface DashboardBaseProps {
  children: React.ReactNode
  title: string
}

export function DashboardBase({ children, title }: DashboardBaseProps) {
  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.container)}>
        <h1 {...stylex.props(styles.title)}>{title}</h1>
        {children}
      </div>
    </div>
  )
}
