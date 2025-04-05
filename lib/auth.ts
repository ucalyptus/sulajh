import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { checkDatabaseConnection } from '@/lib/db-check'
import { redirect } from 'next/navigation'
import type { UserRole } from '@prisma/client'
import { getServerSession } from 'next-auth'

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const isConnected = await checkDatabaseConnection()
          if (!isConnected) {
            throw new Error('Database connection failed')
          }

          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter your email and password')
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log('User not found:', credentials.email)
            throw new Error('No user found with this email')
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  session: {
    strategy: 'jwt'
  }
}

export async function requireAuth(allowedRoles: UserRole[]) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (!allowedRoles.includes(session.user.role as UserRole)) {
    redirect('/unauthorized')
  }

  return session
}

export async function auth() {
  return await getServerSession(authOptions)
} 