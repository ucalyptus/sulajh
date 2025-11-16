type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    }

    if (this.isDevelopment) {
      // In development, log to console
      switch (level) {
        case 'error':
          console.error(`[${timestamp}] ERROR:`, message, context)
          break
        case 'warn':
          console.warn(`[${timestamp}] WARN:`, message, context)
          break
        case 'debug':
          console.debug(`[${timestamp}] DEBUG:`, message, context)
          break
        default:
          console.log(`[${timestamp}] INFO:`, message, context)
      }
    } else {
      // In production, you would send to a logging service
      // Example: Sentry, LogRocket, Datadog, etc.
      // trackError(logData)

      // For now, only log errors in production
      if (level === 'error') {
        console.error(JSON.stringify(logData))
      }
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  error(message: string, error?: unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    }
    this.log('error', message, errorContext)
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context)
  }
}

export const logger = new Logger()

// Convenience functions for common use cases
export function logApiError(
  endpoint: string,
  error: unknown,
  context?: LogContext
) {
  logger.error(`API Error: ${endpoint}`, error, context)
}

export function logDatabaseError(
  operation: string,
  error: unknown,
  context?: LogContext
) {
  logger.error(`Database Error: ${operation}`, error, context)
}

export function logAuthError(message: string, error: unknown, context?: LogContext) {
  logger.error(`Auth Error: ${message}`, error, context)
}
