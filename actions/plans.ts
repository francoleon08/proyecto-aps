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

export async function getActivePlans(): Promise<Tables<'plans'>[]>{
  const { data, error } = await supabase.from('plans').select('*').eq('is_active', true)
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
  const { data: policy, error: error_policy } = await supabase
    .from('contracted_policy')
    .select('id')
    .eq('policy_type_id', id)
    .limit(1)
  if (error_policy) throw new Error(error_policy.message)
  if (policy && policy.length > 0) return false

  const { error: error_plan } = await supabase.from('plans').delete().eq('id', id)
  if (error_plan) throw new Error(error_plan.message)
  revalidatePath('/plans', 'layout')
  return true
}

export async function getBasePrices(): Promise<Record<string, number>> {
  const { data: plans, error } = await supabase
    .from('plans')
    .select('category, base_price')
    .eq('is_active', true)

  if (error) throw new Error(error.message)
  if (!plans || plans.length === 0) throw new Error('No plans found')

  const basePrices = Object.fromEntries(
    plans.map(plan => [plan.category, plan.base_price])
  )

  return basePrices
}
