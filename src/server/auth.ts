import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getCookie, setCookie, deleteCookie } from '@/src/server/cookies'

const { compare, hash } = bcrypt

// Fail fast at startup rather than silently falling back to a known secret.
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET
if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET (or NEXTAUTH_SECRET) must be set in the environment'
  )
}

const TOKEN_COOKIE = 'sulajh-session'

export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: string
}

function signToken(user: SessionUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser
  } catch {
    return null
  }
}

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const token = await getCookie(TOKEN_COOKIE)
    if (!token) return null
    return verifyToken(token)
  }
)

export const signIn = createServerFn({ method: 'POST' })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { email, password } = data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new Error('No user found with this email')
    }

    const isValid = await compare(password, user.password)
    if (!isValid) {
      throw new Error('Invalid password')
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    const token = signToken(sessionUser)
    await setCookie(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return sessionUser
  })

export const signUp = createServerFn({ method: 'POST' })
  .validator(
    (d: { email: string; password: string; name: string; role?: string; invitationToken?: string }) => d
  )
  .handler(async ({ data }) => {
    const { email, password, name, role, invitationToken } = data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new Error('User already exists with this email')
    }

    const hashedPassword = await hash(password, 12)

    // Self-registration may only ever create CLAIMANT accounts. Any other
    // role comes from a validated invitation (RESPONDENT) or admin creation.
    let assignedRole: 'CLAIMANT' | 'RESPONDENT' = 'CLAIMANT'
    if (role && role !== 'CLAIMANT' && !invitationToken) {
      throw new Error('Invalid role requested')
    }

    if (invitationToken) {
      const invitation = await prisma.caseInvitation.findUnique({
        where: { token: invitationToken },
      })

      // Takeover guards: token must be PENDING, unexpired, and addressed to
      // exactly the email being registered (case-insensitive).
      if (
        !invitation ||
        invitation.status !== 'PENDING' ||
        invitation.expiresAt <= new Date() ||
        invitation.email.trim().toLowerCase() !== email.trim().toLowerCase()
      ) {
        throw new Error('Invalid or expired invitation for this email')
      }

      const user = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            role: 'RESPONDENT',
          },
        })

        // Atomic claim: only succeeds if the invitation is still PENDING.
        // A count of 0 means a concurrent signup consumed it first.
        const claimed = await tx.caseInvitation.updateMany({
          where: {
            id: invitation.id,
            status: 'PENDING',
            expiresAt: { gt: new Date() },
          },
          data: { status: 'ACCEPTED' },
        })
        if (claimed.count === 0) {
          throw new Error('Invalid or expired invitation for this email')
        }

        await tx.case.update({
          where: { id: invitation.caseId },
          data: { respondentId: created.id, status: 'IN_PROGRESS' },
        })

        return created
      })

      const sessionUser: SessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
      const sessionToken = signToken(sessionUser)
      await setCookie(TOKEN_COOKIE, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      return sessionUser
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'CLAIMANT',
      },
    })

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    const token = signToken(sessionUser)
    await setCookie(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return sessionUser
  })

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  await deleteCookie(TOKEN_COOKIE)
  return { success: true }
})
