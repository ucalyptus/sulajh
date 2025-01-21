import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserManagement } from '@/components/admin/UserManagement'

export default async function AdminUsersPage() {
  // Only Registrar can access this page
  const session = await requireAuth(['REGISTRAR'])

  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ['CASE_MANAGER', 'NEUTRAL']
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <UserManagement users={users} />
} 