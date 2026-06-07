import { getRequestHeaders, setResponseHeader } from '@tanstack/react-start/server'

export async function getCookie(name: string): Promise<string | null> {
  const headers = getRequestHeaders()
  const cookieHeader = headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...val] = c.trim().split('=')
      return [key, val.join('=')]
    })
  )
  return cookies[name] || null
}

interface CookieOptions {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'lax' | 'strict' | 'none'
  maxAge?: number
  path?: string
}

export async function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): Promise<void> {
  const parts = [`${name}=${value}`]
  if (options.httpOnly) parts.push('HttpOnly')
  if (options.secure) parts.push('Secure')
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)
  if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`)
  if (options.path) parts.push(`Path=${options.path}`)

  setResponseHeader('Set-Cookie', parts.join('; '))
}

export async function deleteCookie(name: string): Promise<void> {
  await setCookie(name, '', { maxAge: 0, path: '/' })
}
