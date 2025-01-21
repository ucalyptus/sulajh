import { DashboardBase } from './DashboardBase'

export function CaseManagerDashboard({ children }: { children: React.ReactNode }) {
  return (
    <DashboardBase title="Case Manager Dashboard">
      {children}
    </DashboardBase>
  )
} 