import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/src/server/auth'

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
