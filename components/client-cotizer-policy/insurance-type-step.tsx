"use client"

import { Card } from "@/components/ui/card"
import { Heart, Home, Car } from "lucide-react"
import type { InsuranceType } from '@/lib/policy-plan'

interface InsuranceTypeStepProps {
  onSelect: (type: InsuranceType) => void
}

export function InsuranceTypeStep({ onSelect }: InsuranceTypeStepProps) {
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">¿Qué deseas asegurar?</h2>
      <p className="text-muted-foreground mb-8">Selecciona el tipo de seguro que necesitas</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onSelect("life")}
          className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
              <Heart className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Persona</h3>
            <p className="text-sm text-muted-foreground text-center">Seguro de vida y salud</p>
          </div>
        </button>

        <button
          onClick={() => onSelect("home")}
          className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
              <Home className="h-12 w-12 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Hogar</h3>
            <p className="text-sm text-muted-foreground text-center">Protección para tu casa</p>
          </div>
        </button>

        <button
          onClick={() => onSelect("vehicle")}
          className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
              <Car className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Auto</h3>
            <p className="text-sm text-muted-foreground text-center">Seguro vehicular completo</p>
          </div>
        </button>
      </div>
    </Card>
  )
}
