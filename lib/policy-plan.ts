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

export const initialQuoteDataMock: QuoteData = {
  insuranceType: null,
  clientType: 'person',
  multiplier: 1,
  policyData: null,
  selectedPlan: null,
  basePrices: {
    Premium: 1500,
    Elite: 1000,
    Basic: 500,
  },
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

export async function getQuoteData(): Promise<QuoteData> {
  //TODO: integrar con backend -> traer solamente los precios base y asignarselos a basePrices
  //Ej: basePrices: await fetch('/api/base-prices').then(res => res.json())
  const basePrices = {
    Premium: 1500,
    Elite: 1000,
    Basic: 500,
  }

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
  //TODO: integrar con backend. En base a un tipo de seguro, traer el multiplicador correspondiente
  //Ej: return await fetch(`/api/multiplier?type=${type}`).then(res => res.json())
  return type === 'life' ? 1 : type === 'home' ? 1.2 : type === 'vehicle' ? 1.5 : 1
}

export async function getAvailablePlans(): Promise<PlanOption[]> {
  //TODO: integrar con backend
  return plansMock
}
