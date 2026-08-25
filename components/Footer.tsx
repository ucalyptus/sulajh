import { Link } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  footer: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    backgroundColor: 'rgba(243, 244, 246, 0.4)',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 768px)': 'repeat(3, 1fr)',
    },
    gap: spacing[8],
  },
  heading: {
    fontWeight: 700,
    fontSize: '1.125rem',
    marginBottom: spacing[2],
    color: colors.foreground,
  },
  subheading: {
    fontWeight: 600,
    fontSize: '0.875rem',
    marginBottom: spacing[2],
    color: colors.foreground,
  },
  text: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    lineHeight: 1.5,
    margin: 0,
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  link: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    textDecoration: 'none',
    transitionProperty: 'color',
    transitionDuration: '0.2s',
    ':hover': {
      color: colors.foreground,
    },
  },
  bottomBar: {
    marginTop: spacing[8],
    paddingTop: spacing[4],
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    textAlign: 'center',
    fontSize: '0.75rem',
    color: colors.mutedForeground,
  },
})

export default function Footer() {
  return (
    <footer {...stylex.props(styles.footer)}>
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.grid)}>
          <div>
            <h3 {...stylex.props(styles.heading)}>Sulajh</h3>
            <p {...stylex.props(styles.text)}>
              AI-powered online dispute resolution — fair, fast, and affordable.
            </p>
          </div>
          <div>
            <h4 {...stylex.props(styles.subheading)}>Platform</h4>
            <ul {...stylex.props(styles.list)}>
              <li><Link to="/cases/new" {...stylex.props(styles.link)}>File a Claim</Link></li>
              <li><Link to="/dashboard" {...stylex.props(styles.link)}>Dashboard</Link></li>
              <li><Link to="/auth/signin" {...stylex.props(styles.link)}>Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 {...stylex.props(styles.subheading)}>Legal</h4>
            <ul {...stylex.props(styles.list)}>
              <li><span {...stylex.props(styles.text)}>Terms of Service</span></li>
              <li><span {...stylex.props(styles.text)}>Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        <div {...stylex.props(styles.bottomBar)}>
          © {new Date().getFullYear()} Sulajh. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
