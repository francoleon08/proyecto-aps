'use client'
import { useState, useEffect } from 'react'

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

interface UserCotizerPolicyProps {
  onBack: () => void
}

export default function UserCotizerPolicy({ onBack }: UserCotizerPolicyProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [quoteData, setQuoteData] = useState<QuoteData>()
  const [loading, setLoading] = useState(true)

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
    const multiplier = await getMultiplierForInsuranceType(type)
    setQuoteData({ ...quoteData, insuranceType: type, multiplier })
    setCurrentStep(2)
  }

  const handlePolicyDataSubmit = (
    data: LifePolicyData | HomePolicyData | VehiclePolicyData,
    clientType: ClientType,
    multiplier: number
  ) => {
    setQuoteData({
      ...quoteData,
      policyData: data,
      clientType,
      multiplier,
    })
    setCurrentStep(3)
  }

  const handlePlanSelect = (plan: PolicyCategory) => {
    setQuoteData({ ...quoteData, selectedPlan: plan })
    setCurrentStep(4)
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

  const handleRegister = () => {
    console.log('Registering policy with data:', quoteData)
  }

  return (
    <main className="bg-white overflow-hidden shadow rounded-lg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Cotizador de Pólizas</h1>
          <p className="text-muted-foreground text-lg">Obtén tu cotización en 4 simples pasos</p>
        </div>

        <StepIndicator currentStep={currentStep} totalSteps={4} />
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="mt-8">
          {currentStep === 1 && <InsuranceTypeStep onSelect={handleInsuranceTypeSelect} />}

          {currentStep === 2 && quoteData.insuranceType && (
            <PolicyDataStep
              insuranceType={quoteData.insuranceType}
              onSubmit={handlePolicyDataSubmit}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <PlanSelectionStep quoteData={quoteData} onSelect={handlePlanSelect} onBack={handleBack} />
          )}

          {currentStep === 4 && (
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
