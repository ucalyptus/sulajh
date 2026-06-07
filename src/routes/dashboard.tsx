import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/src/server/auth'
import { prisma } from '@/lib/prisma'
import { DashboardBase } from '@/components/dashboards/DashboardBase'
import { CaseManagerDashboard } from '@/components/dashboards/CaseManagerDashboard'
import { NeutralDashboard } from '@/components/dashboards/NeutralDashboard'
import { PartyDashboard } from '@/components/dashboards/PartyDashboard'

const getDashboardSession = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  if (!session) throw redirect({ to: '/auth/signin' })
  return session
})

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
  loader: () => getDashboardSession(),
})

function DashboardLayout() {
  const session = Route.useLoaderData()

  switch (session.role) {
    case 'REGISTRAR':
      return <DashboardBase title="Registrar Dashboard"><Outlet /></DashboardBase>
    case 'CASE_MANAGER':
      return <CaseManagerDashboard><Outlet /></CaseManagerDashboard>
    case 'NEUTRAL':
      return <NeutralDashboard><Outlet /></NeutralDashboard>
    default:
      return <PartyDashboard><Outlet /></PartyDashboard>
  }
}
