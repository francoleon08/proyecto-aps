import { getActivePlans, getBasePrices } from '@/actions/plans'
import { Enums, Tables } from '@/types/database'


export type InsuranceType = 'life' | 'home' | 'vehicle' | null
export type PolicyCategory = 'Premium' | 'Elite' | 'Basic'
export type ClientType = 'person' | 'business'

export interface LifePolicyData {
  certPresented: string
  certData: string
}

export interface HomePolicyData {
  constructionType: 'Brick' | 'Concrete' | 'Wood' | 'Mixed'
  buildingAge: number
  city: string
  neighborhood: string
}

export interface VehiclePolicyData {
  vehicleYear: number
  vehicleModel: string
  vehicleTheftRisk: string
  driverViolations: number
}

export interface QuoteData {
  insuranceType: InsuranceType
  clientType: ClientType
  multiplier: number
  policyData: LifePolicyData | HomePolicyData | VehiclePolicyData | null
  selectedPlan: PolicyCategory | null
  basePrices: Record<string, number>
}

export interface PlanOption {
  name: PolicyCategory
  features: string[]
  recommended?: boolean
}

export async function getQuoteData(): Promise<QuoteData> {
  const res = await fetch('/api/plans/base-prices')
  if (!res.ok) throw new Error('Failed to fetch active plans')
  const basePrices = await res.json()

  const data: QuoteData = {
    insuranceType: null,
    clientType: 'person',
    multiplier: 1,
    policyData: null,
    selectedPlan: null,
    basePrices,
  }
  return data
}

export async function getMultiplierForInsuranceType(type: InsuranceType): Promise<number> {
  const res = await fetch('/api/plans/multiplier?type=${type}')
  if (!res.ok) throw new Error('Failed to fetch plan multiplier')
  const multiplier = await res.json()

  return multiplier
}

export async function getAvailablePlans(): Promise<PlanOption[]> {
  const res = await fetch('/api/plans/active')
  if (!res.ok) throw new Error('Failed to fetch active plans')
  const plans: Tables<'plans'>[] = await res.json()

  const planOptions: PlanOption[] = plans.map(plan => ({
    name: plan.category as Enums<'policy_type_enum'>,
    features: plan.benefits as string[],
    recommended: plan.category === 'Elite',
  }))

  return planOptions
}
