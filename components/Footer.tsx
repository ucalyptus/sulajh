import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">Sulajh</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered online dispute resolution — fair, fast, and affordable.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm">Platform</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/cases/new" className="hover:text-foreground transition-colors">File a Claim</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/auth/signin" className="hover:text-foreground transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm">Legal</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><span>Terms of Service</span></li>
              <li><span>Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sulajh. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
