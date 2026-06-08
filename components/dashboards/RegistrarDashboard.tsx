import { DashboardBase } from './DashboardBase'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function RegistrarDashboard({ children }: { children: React.ReactNode }) {
  return (
    <DashboardBase title="Registrar Dashboard">
      <div className="mb-8 flex justify-between items-center">
        <div className="space-x-4">
          <Link to="/dashboard">
            <Button variant="outline">Cases</Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="outline">Manage Users</Button>
          </Link>
        </div>
      </div>
      {children}
    </DashboardBase>
  )
} 