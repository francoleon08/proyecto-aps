'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, ArrowLeft } from 'lucide-react'
import { QuoteData, PolicyCategory, PlanOption, getAvailablePlans } from '@/lib/policy-plan'

interface PlanSelectionStepProps {
  quoteData: QuoteData
  onSelect: (plan: PolicyCategory) => void
  onBack: () => void
}

export function PlanSelectionStep({ quoteData, onSelect, onBack }: PlanSelectionStepProps) {
  const [plans, setPlans] = useState<PlanOption[]>([])

  useEffect(() => {
    const fetchPlans = async () => {
      const availablePlans = await getAvailablePlans()
      setPlans(availablePlans)
    }

    fetchPlans()
  }, [])
  const calculatePrice = (plan: PolicyCategory) => {
    return Math.round(quoteData.basePrices[plan] * quoteData.multiplier)
  }

  return (
    <Card className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Selecciona tu Plan</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-lg border-2 p-6 transition-all flex flex-col h-full
              ${
                plan.recommended
                  ? 'border-red-600 bg-gray-100 shadow-lg'
                  : 'border-border bg-card hover:border-primary/50'
              }
            `}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  Recomendado
                </span>
              </div>
            )}

            <div className={`text-center mb-6 ${plan.recommended ? 'text-primary' : 'text-foreground'}`}>
              <h3 className={`text-2xl font-bold mb-2 ${plan.recommended ? 'text-primary' : 'text-foreground'}`}>
                {plan.name}
              </h3>
              <div className={`text-3xl font-bold ${plan.recommended ? 'text-primary' : 'text-primary'}`}>
                ${calculatePrice(plan.name)}
                <span className="text-sm text-muted-foreground font-normal">/mes</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check
                    className={`h-5 w-5 flex-shrink-0 mt-0.5 ${plan.recommended ? 'text-primary' : 'text-primary'}`}
                  />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => onSelect(plan.name)}
              className={`w-full mt-auto ${
                plan.recommended
                  ? 'bg-red-500 text-white hover:bg-primary/90'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary/90 hover:text-white transition-colors duration-200'
              }`}
            >
              Seleccionar {plan.name}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
