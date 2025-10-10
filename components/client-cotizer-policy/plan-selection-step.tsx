"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowLeft } from "lucide-react"
import type { QuoteData, PolicyCategory } from "@/components/user-cotizer-policy"

interface PlanSelectionStepProps {
  quoteData: QuoteData
  onSelect: (plan: PolicyCategory) => void
  onBack: () => void
}

export function PlanSelectionStep({ quoteData, onSelect, onBack }: PlanSelectionStepProps) {
  const plans: Array<{
    name: PolicyCategory
    features: string[]
    recommended?: boolean
  }> = [
    {
      name: "Basic",
      features: ["Cobertura básica", "Asistencia 24/7", "Deducible estándar", "Renovación anual"],
    },
    {
      name: "Elite",
      features: [
        "Cobertura ampliada",
        "Asistencia prioritaria",
        "Deducible reducido",
        "Beneficios adicionales",
        "Renovación automática",
      ],
      recommended: true,
    },
    {
      name: "Premium",
      features: [
        "Cobertura total",
        "Asistencia VIP",
        "Sin deducible",
        "Todos los beneficios",
        "Renovación automática",
        "Asesor personal",
      ],
    },
  ]

  const calculatePrice = (plan: PolicyCategory) => {
    return Math.round(quoteData.basePrices[plan] * quoteData.multiplier)
  }

  return (
    <Card className="p-8 border-2 border-border">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Selecciona tu Plan</h2>
          <p className="text-muted-foreground">
            Cliente: {quoteData.clientType === "person" ? "Persona" : "Empresa"} | Multiplicador: {quoteData.multiplier}
            x
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-lg border-2 bg-card p-6 transition-all ${
              plan.recommended ? "border-primary shadow-lg" : "border-border hover:border-primary/50"
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Recomendado
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-primary">
                ${calculatePrice(plan.name)}
                <span className="text-sm text-muted-foreground font-normal">/mes</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => onSelect(plan.name)}
              className={`w-full ${
                plan.recommended
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
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
