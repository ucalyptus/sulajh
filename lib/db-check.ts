import { prisma } from './prisma'

export async function checkDatabaseConnection() {
  try {
    // Try to query users table
    await prisma.user.findFirst()
    console.log('Database connection successful')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
} 