import { cookies } from 'next/headers'
import { AuthUser } from './auth'

const SESSION_COOKIE_NAME = 'auth-session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 días

export interface SessionData {
  user: AuthUser
  expires: string
}

// Create session (only for Server Components)
export function createSession(user: AuthUser): void {
  const expires = new Date(Date.now() + SESSION_MAX_AGE * 1000)
  const sessionData: SessionData = {
    user,
    expires: expires.toISOString()
  }

  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
}

// Get session (only for Server Components)
export function getSession(): SessionData | null {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    
    if (!sessionCookie) {
      return null
    }

    const sessionData: SessionData = JSON.parse(sessionCookie.value)
    
    // Check if session has expired
    if (new Date(sessionData.expires) < new Date()) {
      deleteSession()
      return null
    }

    return sessionData
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Delete session (only for Server Components)
export function deleteSession(): void {
  const cookieStore = cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

// Check if user is authenticated (only for Server Components)
export function isAuthenticated(): boolean {
  const session = getSession()
  return session !== null
}

// Get current user (only for Server Components)
export function getCurrentUser(): AuthUser | null {
  const session = getSession()
  return session?.user || null
}

// Check if user has a specific role (only for Server Components)
export function hasRole(requiredRole: string): boolean {
  const user = getCurrentUser()
  return user?.user_type === requiredRole
}

// Check if user has one of the allowed roles (only for Server Components)
export function hasAnyRole(allowedRoles: string[]): boolean {
  const user = getCurrentUser()
  return user ? allowedRoles.includes(user.user_type) : false
}
