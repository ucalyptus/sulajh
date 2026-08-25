import { DashboardBase } from './DashboardBase'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import * as stylex from '@stylexjs/stylex'
import { spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  topRow: {
    marginBottom: spacing[8],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: spacing[4],
  },
})

export function RegistrarDashboard({ children }: { children: React.ReactNode }) {
  return (
    <DashboardBase title="Registrar Dashboard">
      <div {...stylex.props(styles.topRow)}>
        <div {...stylex.props(styles.buttonGroup)}>
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
