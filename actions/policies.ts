'use server'

import { createClient } from '@supabase/supabase-js'
import { Database, Tables } from '@/types/database'
import {
  InsuranceType,
  LifePolicyData,
  HomePolicyData,
  VehiclePolicyData,
  ClientType,
  QuoteData,
  PolicyCategory,
  getQuoteData,
  getMultiplierForInsuranceType,
} from '@/lib/policy-plan'


const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function createContractedPolicy(quoteData: QuoteData): Promise<String | null>{
  var policyID
  switch(quoteData.insuranceType){
    case "life": 
      policyID = createLifePolicy(quoteData.policyData as LifePolicyData)
      break;
    case "home": 
      policyID = createHomePolicy(quoteData.policyData as HomePolicyData)
      break;
    case "vehicle": 
      policyID = createVehiclePolicy(quoteData.policyData as VehiclePolicyData);
  }

  //get userID
  //create policyPADRE

  return null
}

async function createLifePolicy(lifePolicyData: LifePolicyData): Promise<String> {
  const { data, error } = await supabase
    .from('life_policy')
    .insert([
      { cert_data: JSON.parse(lifePolicyData.certData), cert_presented: lifePolicyData.certPresented },
    ])
    .select('id')
    .single()
    
    if (error) throw new Error(error.message)
    return data.id
}

async function createHomePolicy(homePolicyData: HomePolicyData): Promise<String> {
  const { data, error } = await supabase
    .from('home_policy')
    .insert([
      { construction_type: homePolicyData.constructionType, 
        building_age: homePolicyData.buildingAge,
        city: homePolicyData.city,
        neighborhood: homePolicyData.neighborhood },
    ])
    .select('id')
    .single()
    
    if (error) throw new Error(error.message)
    return data.id
}