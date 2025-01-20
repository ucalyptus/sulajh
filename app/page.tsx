// Main landing page
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Online Dispute Resolution Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Resolve disputes efficiently and fairly
          </p>
          <Link href="/cases/new">
            <Button size="lg">
              File a Claim
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

