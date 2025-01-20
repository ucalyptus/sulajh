import { requireAuth } from '@/lib/auth'
import { DashboardBase } from '@/components/dashboards/DashboardBase'
import { CaseManagerDashboard } from '@/components/dashboards/CaseManagerDashboard'
import { NeutralDashboard } from '@/components/dashboards/NeutralDashboard'
import { PartyDashboard } from '@/components/dashboards/PartyDashboard'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await requireAuth(['CLAIMANT', 'RESPONDENT', 'CASE_MANAGER', 'REGISTRAR', 'NEUTRAL'])
  
  switch (session.user.role) {
    case 'REGISTRAR':
      return <DashboardBase title="Registrar Dashboard">{children}</DashboardBase>
    case 'CASE_MANAGER':
      return <CaseManagerDashboard>{children}</CaseManagerDashboard>
    case 'NEUTRAL':
      return <NeutralDashboard>{children}</NeutralDashboard>
    default:
      return <PartyDashboard>{children}</PartyDashboard>
  }
} 