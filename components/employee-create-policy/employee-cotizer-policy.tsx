'use client'
import { useState, useEffect } from 'react'
import { SelectClientStep } from '@/components/employee-create-policy/step-client'
import { InsuranceTypeStep } from '@/components/client-cotizer-policy/insurance-type-step'
import { PolicyDataStep } from '@/components/client-cotizer-policy/policy-data-step'
import { PlanSelectionStep } from '@/components/client-cotizer-policy/plan-selection-step'
import { QuoteSummaryStep } from '@/components/client-cotizer-policy/quote-summary-step'
import { StepIndicator } from '@/components/client-cotizer-policy/step-indicator'
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
import toast from 'react-hot-toast'

interface Client {
  id: string
  name: string
}

interface EmployeeCotizerPolicyProps {
  onBack: () => void
}

export default function EmployeeCotizerPolicy({ onBack }: EmployeeCotizerPolicyProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [quoteData, setQuoteData] = useState<QuoteData>()
  const [loading, setLoading] = useState(true)
  const [clientId, setClientId] = useState<Client | null>(null)

  const fetchInitialData = async () => {
    const initialData = await getQuoteData()
    setQuoteData(initialData)
    setLoading(false)
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  if (loading || !quoteData) {
    return (
      <div>
        <p className="text-center text-foreground">Cargando cotizador...</p>
      </div>
    )
  }

  const handleInsuranceTypeSelect = async (type: InsuranceType) => {
    console.log(type)
    const multiplier = await getMultiplierForInsuranceType(type)
    setQuoteData((prev) => ({ ...prev!, insuranceType: type, multiplier }))
    setCurrentStep(3)
  }

  const handlePolicyDataSubmit = (
    data: LifePolicyData | HomePolicyData | VehiclePolicyData,
    clientType: ClientType
  ) => {
    setQuoteData((prev) => ({
      ...prev!,
      policyData: data,
      clientType,
    }))
    setCurrentStep(4)
  }

  const handlePlanSelect = (plan: PolicyCategory) => {
    setQuoteData({ ...quoteData, selectedPlan: plan })
    setCurrentStep(5)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setLoading(true)
    fetchInitialData()
    setCurrentStep(1)
  }

  const handleRegister = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        const res = await fetch('/api/policy/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            insuranceType: quoteData.insuranceType,
            clientType: quoteData.clientType,
            multiplier: quoteData.multiplier,
            policyData: quoteData.policyData,
            selectedPlan: quoteData.selectedPlan,
            basePrices: quoteData.basePrices,
          }),
        })
        const data = await res.json()
        if (res.ok) {
          resolve('Póliza registrada exitosamente, será redirigido al inicio')
          setTimeout(() => {
            return (window.location.href = '/dashboard/client')
          }, 2000)
        } else {
          reject(data.error || 'Error al registrar la póliza')
        }
      }),
      {
        loading: 'Registrando póliza...',
        success: 'Póliza registrada exitosamente, será redirigido al inicio',
        error: (err) => `Error al registrar la póliza: ${err.message}`,
      }
    )
  }

  return (
    <main className="bg-white overflow-hidden shadow rounded-lg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Registrar Póliza</h1>
          <p className="text-muted-foreground text-lg">Obtén tu cotización en 4 simples pasos</p>
        </div>

        <StepIndicator currentStep={currentStep} totalSteps={5} />
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="mt-8">
          {currentStep === 1 && <SelectClientStep onSelect={(client) => { setClientId(client); setCurrentStep(2); }} />}

          {currentStep === 2 && <InsuranceTypeStep onSelect={handleInsuranceTypeSelect} onBack={handleBack} />}

          {currentStep === 3 && quoteData.insuranceType && (
            <PolicyDataStep
              insuranceType={quoteData.insuranceType}
              onSubmit={handlePolicyDataSubmit}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <PlanSelectionStep quoteData={quoteData} onSelect={handlePlanSelect} onBack={handleBack} />
          )}

          {currentStep === 5 && (
            <QuoteSummaryStep
              quoteData={quoteData}
              onBack={handleBack}
              onReset={handleReset}
              onConfirm={handleRegister}
            />
          )}
        </div>
        <div className="mt-8 text-right">
          <button onClick={onBack} className="text-md text-primary hover:underline">
            &larr; Volver al Dashboard
          </button>
        </div>
      </div>
    </main>
  )
}
