import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/src/server/auth'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { Resend } from 'resend'
import { generateUserInvitationEmail } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export const getAdminCases = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session || session.role !== 'REGISTRAR') throw new Error('Unauthorized')

  return prisma.case.findMany({
    include: {
      claimant: { select: { id: true, name: true, email: true } },
      respondent: { select: { id: true, name: true, email: true } },
      caseManager: { select: { id: true, name: true, email: true } },
      neutral: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
})

export const getAdminUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session || session.role !== 'REGISTRAR') throw new Error('Unauthorized')

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
})

export const updateUserRole = createServerFn({ method: 'POST' })
  .validator((d: { userId: string; role: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session || session.role !== 'REGISTRAR') throw new Error('Unauthorized')

    return prisma.user.update({
      where: { id: data.userId },
      data: { role: data.role as any },
    })
  })

export const createAdminUser = createServerFn({ method: 'POST' })
  .validator(
    (d: { email: string; name: string; role: 'CASE_MANAGER' | 'NEUTRAL' }) => d
  )
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session || session.role !== 'REGISTRAR') throw new Error('Unauthorized')

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw new Error('User already exists with this email')

    // Cryptographically random one-time password; only the bcrypt hash is stored.
    const tempPassword = randomBytes(18).toString('base64url')
    const hashedPassword = await bcrypt.hash(tempPassword, 12)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    try {
      await resend.emails.send({
        from: `Sulajh <${process.env.RESEND_FROM_EMAIL || 'sulajh@resend.ucalyptus.me'}>`,
        to: process.env.NODE_ENV === 'development' ? process.env.VERIFIED_EMAIL! : data.email,
        subject: 'Your Sulajh account credentials',
        html: generateUserInvitationEmail({
          name: data.name,
          email: data.email,
          password: tempPassword,
          role: data.role,
        }),
        replyTo: process.env.SUPPORT_EMAIL,
      })
    } catch (e) {
      // Roll back the user so a retry doesn't hit "already exists" with
      // credentials that were never delivered.
      await prisma.user.delete({ where: { id: user.id } }).catch((delErr) => {
        console.error('Cleanup of undeliverable user failed:', delErr)
      })
      console.error('Invitation email failed:', e)
      throw new Error('Failed to send invitation email; user was not created. Please try again.')
    }

    return user
  })
