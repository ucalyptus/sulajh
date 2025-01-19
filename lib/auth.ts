import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import type { UserRole } from '@prisma/client'

export async function requireAuth(allowedRoles: UserRole[]) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (!allowedRoles.includes(session.user.role as UserRole)) {
    redirect('/unauthorized')
  }

  return session
} 