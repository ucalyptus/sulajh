import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './providers'
import NavMenu from '@/components/NavMenu'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Sulajh — Online Dispute Resolution',
    template: '%s | Sulajh',
  },
  description:
    'Resolve disputes efficiently, fairly, and affordably with AI-powered online dispute resolution. File claims, respond, and reach settlements — all online.',
  keywords: ['dispute resolution', 'ODR', 'online mediation', 'arbitration', 'legal tech'],
  authors: [{ name: 'Sulajh' }],
  openGraph: {
    title: 'Sulajh — Online Dispute Resolution',
    description: 'Resolve disputes efficiently and fairly with AI-powered ODR.',
    url: 'https://sulajh.vercel.app',
    siteName: 'Sulajh',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sulajh — Online Dispute Resolution',
    description: 'Resolve disputes efficiently and fairly with AI-powered ODR.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NavMenu />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
