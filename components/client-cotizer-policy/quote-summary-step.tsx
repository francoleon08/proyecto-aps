'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, User } from 'lucide-react'
import type { QuoteData } from '@/lib/policy-plan'

interface Client {
  id: string
  name: string
}

interface QuoteSummaryStepProps {
  quoteData: QuoteData
  onBack: () => void
  onReset: () => void
  onConfirm?: () => void
  client?: Client | null
}

export function QuoteSummaryStep({ quoteData, onBack, onReset, onConfirm, client }: QuoteSummaryStepProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeRandom = Math.floor(Math.random() * 1000) + 1000

    const timer = setTimeout(() => {
      setLoading(false)
    }, timeRandom)

    return () => clearTimeout(timer)
  }, [])

  const finalPrice = quoteData.selectedPlan
    ? Math.round(quoteData.basePrices[quoteData.selectedPlan] * quoteData.multiplier)
    : 0

  const getInsuranceTypeName = () => {
    switch (quoteData.insuranceType) {
      case 'life':
        return 'Seguro de Vida'
      case 'home':
        return 'Seguro de Hogar'
      case 'vehicle':
        return 'Seguro de Auto'
      default:
        return 'Seguro'
    }
  }

  if (loading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <div className="text-center text-foreground">Calculando tu cotización...</div>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cotización Final</h2>
          <p className="text-muted-foreground">Resumen de tu póliza de seguro</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Success Message */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg border border-primary/20">
          <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
          <p className="text-foreground font-medium">¡Tu cotización está lista!</p>
        </div>
         {/* Client Information */}
        <div className="flex items-center gap-3 p-4 rounded-lg border border-primary/20">
          <User className="h-6 w-6 text-primary flex-shrink-0" />
          <p className="text-foreground font-medium">Cliente: {client?.name}</p>
        </div>

        {/* Quote Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Tipo de Seguro</p>
              <p className="text-lg font-semibold text-foreground">{getInsuranceTypeName()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Plan</p>
              <p className="text-lg font-semibold text-foreground">{quoteData.selectedPlan}</p>
            </div>
          </div>
        </div>

        {/* Calculation Formula */}
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-foreground mb-3">Cálculo de la Cotización</h3>
          <div className="flex items-center justify-end w-full">
            <span className="text-xl font-bold text-primary bg-primary/10 px-2 py-2 rounded-lg">${finalPrice}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button onClick={onReset} variant="outline" className="flex-1 border-border bg-transparent">
            Nueva Cotización
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!onConfirm}
            variant="default"
            className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"            
          >
            Contratar Ahora
          </Button>
        </div>
      </div>
    </Card>
  )
}
