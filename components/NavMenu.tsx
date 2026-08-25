'use client'

import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getSession, signOut } from '@/src/server/auth'
import type { SessionUser } from '@/src/server/auth'
import { Button } from '@/components/ui/button'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
  },
  container: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    height: '3.5rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    textDecoration: 'none',
  },
  brandText: {
    fontWeight: 700,
    fontSize: '1.25rem',
    color: colors.primary,
  },
  linksDesktop: {
    display: {
      default: 'none',
      '@media (min-width: 768px)': 'flex',
    },
    alignItems: 'center',
    gap: spacing[1],
  },
  link: {
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
    paddingTop: spacing[1.5],
    paddingBottom: spacing[1.5],
    borderRadius: radii.md,
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecoration: 'none',
    color: colors.mutedForeground,
    transitionProperty: 'background-color, color',
    transitionDuration: '0.2s',
    ':hover': {
      color: colors.foreground,
      backgroundColor: colors.accent,
    },
  },
  linkActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    color: colors.primary,
  },
  actionsDesktop: {
    display: {
      default: 'none',
      '@media (min-width: 768px)': 'flex',
    },
    alignItems: 'center',
    gap: spacing[2],
  },
  emailText: {
    fontSize: '0.75rem',
    color: colors.mutedForeground,
    marginRight: spacing[1],
  },
  mobileButton: {
    display: {
      default: 'block',
      '@media (min-width: 768px)': 'none',
    },
    padding: spacing[2],
    borderRadius: radii.md,
    backgroundColor: 'transparent',
    borderWidth: 0,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: colors.accent,
    },
  },
  mobileMenu: {
    display: {
      default: 'block',
      '@media (min-width: 768px)': 'none',
    },
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[3],
  },
  mobileLink: {
    display: 'block',
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    borderRadius: radii.md,
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecoration: 'none',
    color: colors.mutedForeground,
    ':hover': {
      color: colors.foreground,
      backgroundColor: colors.accent,
    },
  },
  mobileDivider: {
    paddingTop: spacing[2],
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    marginTop: spacing[2],
  },
  mobileSignOut: {
    width: '100%',
    textAlign: 'left',
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    borderRadius: radii.md,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.mutedForeground,
    backgroundColor: 'transparent',
    borderWidth: 0,
    cursor: 'pointer',
    ':hover': {
      color: colors.foreground,
      backgroundColor: colors.accent,
    },
  },
})

export default function NavMenu() {
  const [session, setSession] = useState<SessionUser | null>(null)
  const location = useLocation()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = location.pathname

  useEffect(() => {
    getSession().then(setSession)
  }, [pathname])

  const role = session?.role

  const navLinks = session
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        ...(role === 'CLAIMANT' || role === 'REGISTRAR'
          ? [{ href: '/cases/new', label: 'File Claim' }]
          : []),
        { href: '/cases', label: 'Cases' },
        ...(role === 'REGISTRAR'
          ? [{ href: '/admin/cases', label: 'Admin' }]
          : []),
      ]
    : []

  const handleSignOut = async () => {
    await signOut()
    setSession(null)
    router.navigate({ to: '/' })
  }

  return (
    <nav {...stylex.props(styles.nav)}>
      <div {...stylex.props(styles.container)}>
        <Link to="/" {...stylex.props(styles.brand)}>
          <span {...stylex.props(styles.brandText)}>⚖️ Sulajh</span>
        </Link>

        <div {...stylex.props(styles.linksDesktop)}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                to={link.href}
                {...stylex.props(styles.link, isActive && styles.linkActive)}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div {...stylex.props(styles.actionsDesktop)}>
          {session ? (
            <>
              <span {...stylex.props(styles.emailText)}>
                {session.email}
              </span>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth/signin">
                <Button size="sm" variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          {...stylex.props(styles.mobileButton)}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div {...stylex.props(styles.mobileMenu)}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                {...stylex.props(styles.mobileLink, isActive && styles.linkActive)}
              >
                {link.label}
              </Link>
            )
          })}
          <div {...stylex.props(styles.mobileDivider)}>
            {session ? (
              <>
                <p {...stylex.props(styles.emailText, { paddingLeft: 12, paddingTop: 4, paddingBottom: 4 })}>{session.email}</p>
                <button
                  onClick={handleSignOut}
                  {...stylex.props(styles.mobileSignOut)}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/signin" onClick={() => setMobileOpen(false)} {...stylex.props(styles.mobileLink)}>
                  Sign In
                </Link>
                <Link to="/auth/signup" onClick={() => setMobileOpen(false)} {...stylex.props(styles.mobileLink, styles.linkActive)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
