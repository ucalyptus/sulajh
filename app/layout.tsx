import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">
              Sulajh
            </Link>
            <div className="space-x-4">
              <Link href="/claimant">Claimant</Link>
              <Link href="/respondent">Respondent</Link>
              <Link href="/case-manager">Case Manager</Link>
              <Link href="/neutral">Neutral</Link>
              <Link href="/registrar">Registrar</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
