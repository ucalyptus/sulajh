import { DashboardBase } from './DashboardBase'

export function PartyDashboard({ children }: { children: React.ReactNode }) {
  return (
    <DashboardBase title="My Cases">
      {children}
    </DashboardBase>
  )
} 