import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { checkDatabaseConnection } from '@/lib/db-check'

export async function POST(request: Request) {
  try {
    // First check database connection
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      throw new Error('Database connection failed')
    }

    const { name, email, password, role, invitationToken } = await request.json()
    console.log('Signup attempt for:', email)

    // List all users before creation
    const allUsersBefore = await prisma.user.findMany()
    console.log('Current users in database:', allUsersBefore)

    // If there's an invitation token, verify it
    if (invitationToken) {
      const invitation = await prisma.caseInvitation.findUnique({
        where: { token: invitationToken },
        select: { email: true, status: true }
      })

      if (!invitation) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid invitation token' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      if (invitation.status !== 'PENDING') {
        return new NextResponse(
          JSON.stringify({ error: 'Invitation has already been used' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      if (invitation.email !== email) {
        return new NextResponse(
          JSON.stringify({ error: 'Email does not match invitation' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists:', email)
      return new NextResponse(
        JSON.stringify({ error: 'User already exists' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Hash password with bcryptjs
    const hashedPassword = await hash(password, 12)

    // Create user
    console.log('Creating new user:', email)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'CLAIMANT'
      }
    })

    console.log('User created successfully:', { email: user.email, id: user.id })

    // Verify user was created by listing all users again
    const allUsersAfter = await prisma.user.findMany()
    console.log('Users in database after creation:', allUsersAfter)

    // If there was an invitation, update its status
    if (invitationToken) {
      await prisma.caseInvitation.update({
        where: { token: invitationToken },
        data: { status: 'ACCEPTED' }
      })
    }

    return new NextResponse(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in signup:', error)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Error creating user',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 