export type UserType = 'client' | 'employee' | 'admin'
export type UserStatus = 'active' | 'inactive'
export type SessionAction = 'login' | 'logout' | 'login_failed' | 'password_reset' | 'account_created' | 'account_deactivated' | 'account_activated'

export interface User {
  id: string
  name: string
  email: string
  password: string
  user_type: UserType
  status: UserStatus
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string | null
  action: SessionAction
  ip_address: string | null
  user_agent: string | null
  timestamp: string
  metadata: Record<string, any> | null
}

export interface DashboardMetrics {
  total_active_users: number
  total_active_employees: number
  total_active_administrators: number
}

export interface RecentSession {
  id: string
  user_name: string | null
  user_email: string | null
  action: SessionAction
  timestamp: string
  ip_address: string | null
  user_agent: string | null
  metadata: Record<string, any> | null
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      sessions: {
        Row: Session
        Insert: Omit<Session, 'id' | 'timestamp'>
        Update: Partial<Omit<Session, 'id' | 'timestamp'>>
      }
    }
  }
}
