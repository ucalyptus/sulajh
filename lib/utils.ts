import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { logger } from './logger'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generatePassword(length = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date'
    }

    // Ensure consistent date format between server and client
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    logger.error('Error formatting date', error)
    return 'Invalid date'
  }
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return 'Invalid date'
    }

    const now = new Date()
    const diffInMs = now.getTime() - dateObj.getTime()

    // Handle future dates
    if (diffInMs < 0) {
      return formatDate(date)
    }

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'

    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
    }

    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
    }

    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30.44) // Average days per month
      return `${months} ${months === 1 ? 'month' : 'months'} ago`
    }

    const years = Math.floor(diffInDays / 365.25) // Account for leap years
    return `${years} ${years === 1 ? 'year' : 'years'} ago`
  } catch (error) {
    logger.error('Error formatting relative date', error)
    return 'Invalid date'
  }
}

export function getNameFromEmail(email: string): string {
  const localPart = email.split('@')[0];
  // Convert something like "john.doe" or "johndoe" to "John Doe"
  return localPart
    .split(/[._-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}
