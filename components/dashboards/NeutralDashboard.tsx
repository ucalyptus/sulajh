import { DashboardBase } from './DashboardBase'

export function NeutralDashboard({ children }: { children: React.ReactNode }) {
  return (
    <DashboardBase title="Neutral Dashboard">
      {children}
    </DashboardBase>
  )
} 