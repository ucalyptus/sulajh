'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const getCasesLink = () => {
    if (session?.user.role === 'REGISTRAR') {
      return '/admin/cases'
    }
    return '/cases'
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Platform
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {session && (
                <>
                  <Link 
                    href="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/dashboard')
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href={getCasesLink()}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(getCasesLink())
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Cases
                  </Link>
                  {session.user.role === 'REGISTRAR' && (
                    <>
                      <Link 
                        href="/admin/users"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          isActive('/admin/users')
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Users
                      </Link>
                      <Link 
                        href="/admin/cases"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          isActive('/admin/cases')
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Manage Cases
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {!session && (
              <>
                <Link 
                  href="/auth/signin"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
            {session && (
              <div className="text-gray-500">
                {session.user.email}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 