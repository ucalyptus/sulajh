import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './providers'
import NavMenu from '@/components/NavMenu'

const inter = Inter({ subsets: ['latin'] })

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
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
