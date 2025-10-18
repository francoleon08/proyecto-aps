'use server'

import { createClient } from '@supabase/supabase-js'
import { Database, Tables } from '@/types/database'
import { cookies } from 'next/headers'
import { LifePolicyData, HomePolicyData, VehiclePolicyData, QuoteData, PolicyCategory } from '@/lib/policy-plan'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function createContractedPolicy(
  quoteData: QuoteData
): Promise<{ success: boolean; error?: string; id?: string }> {
  const userID = await getUserIdFromCookie()
  if (!userID.success)
    return {
      success: false,
      error: userID.error,
    }

  const planID = await getPlanId(quoteData.selectedPlan as PolicyCategory)
  if (!planID.success) return { success: false, error: planID.error }

  const generalPolicyID = await createGeneralPolicy(userID.id as string, planID.id as string)
  if (!generalPolicyID.success) return { success: false, error: generalPolicyID.error }

  switch (quoteData.insuranceType) {
    case 'life':
      await createLifePolicy(generalPolicyID.id as string, quoteData.policyData as LifePolicyData)
      break
    case 'home':
      await createHomePolicy(generalPolicyID.id as string, quoteData.policyData as HomePolicyData)
      break
    case 'vehicle':
      await createVehiclePolicy(generalPolicyID.id as string, quoteData.policyData as VehiclePolicyData)
  }

  return { success: true, id: generalPolicyID.id }
}

interface SessionTokenId {
  user: {
    id: string
  }
}

async function getUserIdFromCookie(): Promise<{ success: boolean; error?: string; id?: string }> {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('auth-session')?.value
  if (!sessionToken) throw new Error('Invalid session token')

  const sessionTokenObj: SessionTokenId = JSON.parse(sessionToken)
  return { success: true, id: sessionTokenObj.user.id }
}

async function getPlanId(type: PolicyCategory): Promise<{ success: boolean; error?: string; id?: string }> {
  if (type === null) throw new Error('null insurance type')
  const { data, error } = await supabase.from('plans').select('id').eq('category', type).single()

  if (error) return { success: false, error: error.message }
  return { success: true, id: data.id }
}

async function createGeneralPolicy(
  userID: string,
  planID: string
): Promise<{ success: boolean; error?: string; id?: string }> {
  const { data, error } = await supabase
    .from('contracted_policy')
    .insert([{ user_id: userID, policy_type_id: planID, policy_number: Math.random() }])
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, id: data.id }
}

async function createLifePolicy(policyID: string, lifePolicyData: LifePolicyData) {
  const jsonCertData = {
    certData: lifePolicyData.certData || 'Sin certificado',
  }

  const isDataPresented = lifePolicyData.certData !== null && lifePolicyData.certData !== undefined

  const { data, error } = await supabase
    .from('life_policy')
    .insert([{ id: policyID, cert_data: JSON.stringify(jsonCertData), cert_presented: isDataPresented }])

  if (error) throw new Error(error.message)
}

async function createHomePolicy(policyID: string, homePolicyData: HomePolicyData) {
  const insertData = {
    id: policyID,
    construction_type: homePolicyData.constructionType.toLowerCase(),
    building_age: homePolicyData.buildingAge,
    city: homePolicyData.city,
    neighborhood: homePolicyData.neighborhood,
  }

  const { data, error } = await supabase.from('home_policy').insert([insertData])
  if (error) throw new Error(error.message)
}

async function createVehiclePolicy(policyID: string, vehiclePolicyData: VehiclePolicyData) {
  let numberRisk;
  switch (vehiclePolicyData.vehicleTheftRisk) {
    case 'low':
      numberRisk = 1;
      break;
    case 'medium':
      numberRisk = 2;
      break;
    case 'high':
      numberRisk = 3;
      break;
    default:
      numberRisk = 0;
  }

  const insertData = {
    id: policyID,
    vehicle_year: vehiclePolicyData.vehicleYear,
    vehicle_model: vehiclePolicyData.vehicleModel,
    vehicle_theft_risk: numberRisk,
    driver_violations: JSON.parse(vehiclePolicyData.driverViolations),
  }

  const { data, error } = await supabase.from('vehicle_policy').insert([insertData])
  if (error) throw new Error(error.message)
}
