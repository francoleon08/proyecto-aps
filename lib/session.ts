import { AuthUser } from './auth'

const SESSION_COOKIE_NAME = 'auth-session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 días

export interface SessionData {
  user: AuthUser
  expires: string
}

// Client-side functions (for components with 'use client')
export const clientSession = {
  // Create session from client
  createSession: async (user: AuthUser) => {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    })
    return response.ok
  },

  // Delete session from client
  deleteSession: async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    })
    return response.ok
  },

  // Get current user from client
  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        return data.user
      }
      return null
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }
}
