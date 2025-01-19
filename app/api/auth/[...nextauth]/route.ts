import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { checkDatabaseConnection } from '@/lib/db-check'

export const authOptions = {
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
          // Check database connection
          const isConnected = await checkDatabaseConnection()
          if (!isConnected) {
            throw new Error('Database connection failed')
          }

          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter your email and password')
          }

          // Find user and log the search
          console.log('Looking for user with email:', credentials.email)
          
          // List all users in database (for debugging)
          const allUsers = await prisma.user.findMany({
            select: { email: true, id: true }
          })
          console.log('All users in database:', allUsers)

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log('User not found:', credentials.email)
            throw new Error('No user found with this email')
          }

          console.log('User found, verifying password')

          // Verify password
          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email)
            throw new Error('Invalid password')
          }

          console.log('Password verified, login successful for:', credentials.email)

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

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 