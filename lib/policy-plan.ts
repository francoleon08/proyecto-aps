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
  basePrices: {
    Premium: number
    Elite: number
    Basic: number
  }
}

export interface PlanOption {
  name: PolicyCategory
  features: string[]
  recommended?: boolean
}

const plansMock: PlanOption[] = [
  {
    name: 'Basic',
    features: ['Cobertura básica', 'Asistencia 24/7', 'Deducible estándar', 'Renovación anual'],
  },
  {
    name: 'Elite',
    features: [
      'Cobertura ampliada',
      'Asistencia prioritaria',
      'Deducible reducido',
      'Beneficios adicionales',
      'Renovación automática',
    ],
    recommended: true,
  },
  {
    name: 'Premium',
    features: [
      'Cobertura total',
      'Asistencia VIP',
      'Sin deducible',
      'Todos los beneficios',
      'Renovación automática',
      'Asesor personal',
    ],
  },
]

export async function getAvailablePlans(): Promise<PlanOption[]> {
  //TODO: integrar con backend
  return plansMock
}
