import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/src/server/auth'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'
import { generateCaseInvitationEmail } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export const getCases = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({ where: { email: session.email } })
  if (!user) throw new Error('User not found')

  if (user.role === 'REGISTRAR') {
    return prisma.case.findMany({
      include: {
        claimant: { select: { id: true, name: true, email: true } },
        respondent: { select: { id: true, name: true, email: true } },
        caseManager: { select: { id: true, name: true, email: true } },
        neutral: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  return prisma.case.findMany({
    where: {
      OR: [
        { claimantId: user.id },
        { respondentId: user.id },
        { caseManagerId: user.id },
        { neutralId: user.id },
      ],
    },
    include: {
      claimant: { select: { id: true, name: true, email: true } },
      respondent: { select: { id: true, name: true, email: true } },
      caseManager: { select: { id: true, name: true, email: true } },
      neutral: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
})

export const getCase = createServerFn({ method: 'GET' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    return prisma.case.findUnique({
      where: { id: data.id },
      include: {
        claimant: { select: { id: true, name: true, email: true } },
        respondent: { select: { id: true, name: true, email: true } },
        caseManager: { select: { id: true, name: true, email: true } },
        neutral: { select: { id: true, name: true, email: true } },
      },
    })
  })

export const createCase = createServerFn({ method: 'POST' })
  .validator((d: { claimantRequest: string; respondentEmail: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    const { claimantRequest, respondentEmail } = data

    if (!claimantRequest?.trim()) {
      throw new Error('Claim details are required')
    }

    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const case_ = await prisma.case.create({
      data: {
        status: 'PENDING_RESPONDENT',
        claimantRequest,
        claimant: { connect: { id: session.id } },
        invitations: {
          create: { email: respondentEmail, token, expiresAt },
        },
      },
      include: {
        claimant: { select: { name: true, email: true } },
      },
    })

    // Send invitation email
    const inviteUrl = `${process.env.NEXTAUTH_URL || process.env.APP_URL}/auth/signup?invitation=${token}`
    const emailHtml = generateCaseInvitationEmail({ inviteUrl, caseId: case_.id })

    try {
      await resend.emails.send({
        from: `Sulajh <${process.env.RESEND_FROM_EMAIL || 'sulajh@resend.ucalyptus.me'}>`,
        to: process.env.NODE_ENV === 'development' ? process.env.VERIFIED_EMAIL! : respondentEmail,
        subject: `Case Response Required - Case #${case_.id}`,
        html: emailHtml,
        replyTo: process.env.SUPPORT_EMAIL,
      })
    } catch (e) {
      console.error('Email send failed:', e)
    }

    return case_
  })

export const respondToCase = createServerFn({ method: 'POST' })
  .validator((d: { caseId: string; response: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    return prisma.case.update({
      where: { id: data.caseId },
      data: {
        respondentResponse: data.response,
        status: 'RESPONSE_SUBMITTED',
      },
    })
  })

export const assignCase = createServerFn({ method: 'POST' })
  .validator(
    (d: { caseId: string; caseManagerId?: string; neutralId?: string }) => d
  )
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session || session.role !== 'REGISTRAR') throw new Error('Unauthorized')

    const updateData: any = {}
    if (data.caseManagerId) {
      updateData.caseManagerId = data.caseManagerId
      updateData.status = 'CASE_MANAGER_ASSIGNED'
    }
    if (data.neutralId) {
      updateData.neutralId = data.neutralId
      updateData.neutralAssigned = true
      updateData.status = 'NEUTRAL_ASSIGNED'
    }

    return prisma.case.update({
      where: { id: data.caseId },
      data: updateData,
    })
  })

export const issueJudgment = createServerFn({ method: 'POST' })
  .validator((d: { caseId: string; decision: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session || session.role !== 'NEUTRAL') throw new Error('Unauthorized')

    return prisma.case.update({
      where: { id: data.caseId },
      data: {
        finalDecision: data.decision,
        status: 'DECISION_ISSUED',
      },
    })
  })
