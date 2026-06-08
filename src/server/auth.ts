import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getCookie, setCookie, deleteCookie } from '@/src/server/cookies'

const { compare, hash } = bcrypt

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'sulajh-secret-key'
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

    let assignedRole = role || 'CLAIMANT'

    // If there's an invitation token, handle it
    if (invitationToken) {
      const invitation = await prisma.invitation.findUnique({
        where: { token: invitationToken },
      })
      if (invitation && !invitation.acceptedAt && invitation.expiresAt > new Date()) {
        assignedRole = 'RESPONDENT'
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: assignedRole as any,
      },
    })

    // Accept invitation if present
    if (invitationToken) {
      const invitation = await prisma.invitation.findUnique({
        where: { token: invitationToken },
      })
      if (invitation) {
        await prisma.invitation.update({
          where: { id: invitation.id },
          data: { acceptedAt: new Date() },
        })
        // Link respondent to the case
        await prisma.case.update({
          where: { id: invitation.caseId },
          data: { respondentId: user.id, status: 'ACTIVE' },
        })
      }
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
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return sessionUser
  })

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  await deleteCookie(TOKEN_COOKIE)
  return { success: true }
})
