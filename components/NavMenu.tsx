'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function NavMenu() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          Sulajh
        </Link>
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/api/auth/signout">Sign Out</Link>
            </>
          ) : (
            <>
              <Link href="/auth/signin">Sign In</Link>
              <Link href="/auth/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 