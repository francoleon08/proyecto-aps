'use server'

import { Subscription } from '@/types/custom'
import { Tables, TablesInsert } from '@/types/database'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { getBasePrices, getPlanMultiplier } from '@/actions/plans'
import { cookies } from 'next/headers'

export async function getUserSubscriptions(id: string): Promise<Subscription[]> {
  const _cookies = cookies()
  const policies: Tables<'contracted_policy'>[] = await getUserContractedPolicies(id)
  return await Promise.all(
    policies.map(async (policy: Tables<'contracted_policy'>) => getSubscriptionFromPolicyId(policy.id))
  )
}

export async function getUserContractedPolicies(id: string): Promise<Tables<'contracted_policy'>[]> {
  const { data, error } = await supabase.from('contracted_policy').select('*').eq('user_id', id)
  if (error) throw new Error(error.message)
  return data || []
}

export async function getSubscriptionFromPolicyId(id: string): Promise<Subscription> {
  const policy: Tables<'contracted_policy'> = await getContractedPolicyById(id)
  const policy_type: Tables<'plans'> = await getPolicyTypeById(policy.policy_type_id)
  const type: string = policy_type.category

  const [homeRes, lifeRes, vehicleRes] = await Promise.all([
    supabase.from('home_policy').select('id').eq('id', id).maybeSingle(),
    supabase.from('life_policy').select('id').eq('id', id).maybeSingle(),
    supabase.from('vehicle_policy').select('id').eq('id', id).maybeSingle(),
  ])

  const isHome = !!homeRes.data
  const isLife = !!lifeRes.data
  const isVehicle = !!vehicleRes.data

  const types: string[] = []
  if (isHome) types.push('Hogar')
  if (isLife) types.push('Personas')
  if (isVehicle) types.push('Vehículos')

  const suffix: string = types.length > 0 ? ` ${types.join(' ')}` : ''
  const name: string = `Plan ${type}${suffix}`
  const base_prices: Record<string, number> = await getBasePrices()
  const multiplier: number = (await getPlanMultiplier(type)) || 1
  const amount: number = Math.round(base_prices[type] * multiplier)
  const paid: boolean = await isContactedPolicyPaid(id)

  return {
    id,
    name,
    type,
    amount,
    selected: false,
    paid,
  }
}
export async function getContractedPolicyById(id: string): Promise<Tables<'contracted_policy'>> {
  const { data, error } = await supabase.from('contracted_policy').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function getPolicyTypeById(id: string): Promise<Tables<'plans'>> {
  const { data, error } = await supabase.from('plans').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function isContactedPolicyPaid(id: string): Promise<boolean> {
  const { data, error } = await supabase.from('payment').select('*').eq('policy_id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data !== null
}

export async function processPayment(payment: TablesInsert<'payment'>): Promise<void> {
  const { error } = await supabase.from('payment').insert(payment)
  if (error) throw new Error(error.message)
  revalidatePath('/payments', 'layout')
}
