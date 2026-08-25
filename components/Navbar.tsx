'use client'

import { Link, useLocation } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  nav: {
    backgroundColor: colors.white,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  container: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '4rem',
  },
  section: {
    display: 'flex',
  },
  brandWrapper: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  brandLink: {
    fontSize: '1.25rem',
    fontWeight: 700,
    textDecoration: 'none',
    color: colors.foreground,
  },
  links: {
    display: {
      default: 'none',
      '@media (min-width: 640px)': 'flex',
    },
    marginLeft: spacing[6],
    gap: spacing[8],
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingLeft: spacing[1],
    paddingRight: spacing[1],
    paddingTop: spacing[1],
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.gray500,
    textDecoration: 'none',
    ':hover': {
      color: colors.gray700,
    },
  },
  linkActive: {
    borderBottomColor: colors.indigo500,
    color: colors.gray900,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  signInLink: {
    color: colors.gray500,
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    borderRadius: radii.md,
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecoration: 'none',
    ':hover': {
      color: colors.gray700,
    },
  },
  signUpLink: {
    backgroundColor: colors.indigo600,
    color: colors.white,
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    borderRadius: radii.md,
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecoration: 'none',
    ':hover': {
      backgroundColor: colors.indigo700,
    },
  },
  userEmail: {
    color: colors.gray500,
    fontSize: '0.875rem',
  },
})

export default function Navbar() {
  const location = useLocation()
  const pathname = location.pathname

  const isActive = (path: string) => pathname === path

  return (
    <nav {...stylex.props(styles.nav)}>
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.row)}>
          <div {...stylex.props(styles.section)}>
            <div {...stylex.props(styles.brandWrapper)}>
              <Link to="/" {...stylex.props(styles.brandLink)}>
                Platform
              </Link>
            </div>
            <div {...stylex.props(styles.links)}>
              <Link
                to="/dashboard"
                {...stylex.props(styles.link, isActive('/dashboard') && styles.linkActive)}
              >
                Dashboard
              </Link>
              <Link
                to="/cases"
                {...stylex.props(styles.link, isActive('/cases') && styles.linkActive)}
              >
                Cases
              </Link>
            </div>
          </div>
          <div {...stylex.props(styles.actions)}>
            <Link
              to="/auth/signin"
              {...stylex.props(styles.signInLink)}
            >
              Sign In
            </Link>
            <Link
              to="/auth/signup"
              {...stylex.props(styles.signUpLink)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
