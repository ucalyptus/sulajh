'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface DashboardUIProps {
  initialCases: any[]
}

export function DashboardUI({ initialCases }: DashboardUIProps) {
  const { data: session } = useSession()
  const isRegistrar = session?.user.role === 'REGISTRAR'

  if (!isRegistrar) return null

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/admin/cases"
            className="flex items-center justify-center p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <span className="text-lg">Cases</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center justify-center p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <span className="text-lg">Manage Users</span>
          </Link>
        </div>
      </div>
    </div>
  )
} 