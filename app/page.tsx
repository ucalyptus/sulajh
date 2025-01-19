// Main landing page
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Dispute Resolution Platform</h1>
      <div className="grid gap-4">
        <Link href="/claimant">
          <Button className="w-full">File a New Claim</Button>
        </Link>
        <Link href="/respondent">
          <Button className="w-full">Respond to a Claim</Button>
        </Link>
        <Link href="/case-manager">
          <Button className="w-full">Case Manager Portal</Button>
        </Link>
        <Link href="/neutral">
          <Button className="w-full">Neutral Portal</Button>
        </Link>
        <Link href="/registrar">
          <Button className="w-full">Registrar Portal</Button>
        </Link>
      </div>
    </div>
  )
}

