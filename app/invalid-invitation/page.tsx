import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function InvalidInvitationPage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Invalid or Expired Invitation</h1>
      <p className="text-gray-600 mb-8">
        This invitation link is either invalid or has expired. Please contact the case administrator for a new invitation.
      </p>
      <Link href="/dashboard">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  )
} 