import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Redirect paths based on user role
    if (token) {
      const role = token.role

      // Protect routes based on role
      if (path.startsWith('/claimant') && role !== 'CLAIMANT') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      if (path.startsWith('/respondent') && role !== 'RESPONDENT') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      if (path.startsWith('/case-manager') && role !== 'CASE_MANAGER') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      if (path.startsWith('/neutral') && role !== 'NEUTRAL') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      if (path.startsWith('/registrar') && role !== 'REGISTRAR') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

// Specify which routes to protect
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/claimant/:path*',
    '/respondent/:path*',
    '/case-manager/:path*',
    '/neutral/:path*',
    '/registrar/:path*'
  ]
} 