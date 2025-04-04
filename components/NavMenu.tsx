'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function NavMenu() {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

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
              <button 
                onClick={handleSignOut}
                className="text-white hover:text-gray-300"
              >
                Sign Out
              </button>
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