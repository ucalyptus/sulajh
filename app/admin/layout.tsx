import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'REGISTRAR') {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
} 