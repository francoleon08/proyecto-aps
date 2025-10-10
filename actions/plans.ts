'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getPlans(): Promise<Tables<'plans'>[]> {
  const { data, error } = await supabase.from('plans').select('*')
  if (error) throw new Error(error.message)
  return data || []
}

export async function getPlanById(id: string): Promise<Tables<'plans'> | null> {
  const { data, error } = await supabase.from('plans').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data || null
}

export async function createPlan(plan: TablesInsert<'plans'>): Promise<Tables<'plans'> | null> {
  const { data, error } = await supabase.from('plans').insert(plan)
  if (error) throw new Error(error.message)
  revalidatePath('/plans', 'layout')
  return data || null
}

export async function updatePlan(id: string, plan: TablesUpdate<'plans'>): Promise<Tables<'plans'> | null> {
  const { data, error } = await supabase.from('plans').update(plan).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/plans', 'layout')
  return data || null
}

export async function deletePlan(id: string): Promise<boolean> {
  // todo: check if the plan is used in any subscriptions before deleting
  const { error } = await supabase.from('plans').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/plans', 'layout')
  return true
}
