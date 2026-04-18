// Main landing page
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const features = [
  {
    icon: '⚖️',
    title: 'Fair & Impartial',
    description: 'AI-assisted mediation ensures both parties are heard equally and objectively.',
  },
  {
    icon: '⚡',
    title: 'Fast Resolution',
    description: 'Resolve disputes in days, not months. No courtroom delays or lengthy procedures.',
  },
  {
    icon: '💰',
    title: 'Affordable',
    description: 'A fraction of the cost of traditional legal proceedings. Accessible to everyone.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'End-to-end encryption. Your case details remain confidential at every step.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered',
    description: 'Intelligent analysis helps identify fair solutions and common ground between parties.',
  },
  {
    icon: '📱',
    title: 'Fully Online',
    description: 'File claims, respond, negotiate, and settle — all from your browser. No travel needed.',
  },
]

const steps = [
  { step: '1', title: 'File a Claim', description: 'Describe your dispute and upload supporting evidence.' },
  { step: '2', title: 'Respondent Notified', description: 'The other party is invited to respond to the claim.' },
  { step: '3', title: 'Mediation & Review', description: 'A case manager and neutral review both sides with AI assistance.' },
  { step: '4', title: 'Resolution', description: 'Reach a fair settlement or receive a binding decision.' },
]

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Resolve Disputes
              <span className="text-primary"> Fairly & Fast</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sulajh is an AI-powered online dispute resolution platform.
              File a claim, negotiate, and reach a fair settlement — all online,
              in days instead of months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={session ? '/cases/new' : '/auth/signup'}>
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  {session ? 'File a Claim' : 'Get Started Free'}
                </Button>
              </Link>
              {session ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signin">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Why Choose Sulajh?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A modern approach to dispute resolution that saves time, money, and stress.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground">Four simple steps to resolve your dispute.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Resolve Your Dispute?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Join thousands using Sulajh for faster, fairer outcomes. No lawyers needed.
        </p>
        <Link href={session ? '/cases/new' : '/auth/signup'}>
          <Button size="lg" className="text-base px-8">
            {session ? 'File a Claim Now' : 'Create Your Free Account'}
          </Button>
        </Link>
      </section>
    </div>
  )
}

