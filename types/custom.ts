import { Tables } from '@/types/database'

export interface DashboardMetrics {
  total_active_users: number
  total_active_employees: number
  total_active_administrators: number
}

export interface RecentSession {
  id: string
  user_name: string | null
  user_email: string | null
  action: Tables<'sessions'>['action']
  timestamp: string
  ip_address: string | null
  user_agent: string | null
  metadata: Record<string, any> | null
}

export type Request = {
  id: number
  client: string
  event: string
  date: string
  state: 'pendiente' | 'aprobada' | 'rechazada'
  description?: string
  amount?: string
}
