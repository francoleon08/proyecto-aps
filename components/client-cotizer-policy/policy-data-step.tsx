"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import type { InsuranceType, LifePolicyData, HomePolicyData, VehiclePolicyData, ClientType } from '@/lib/policy-plan'

interface PolicyDataStepProps {
  insuranceType: InsuranceType
  onSubmit: (
    data: LifePolicyData | HomePolicyData | VehiclePolicyData,
    clientType: ClientType,
    multiplier: number,
  ) => void
  onBack: () => void
}

export function PolicyDataStep({ insuranceType, onSubmit, onBack }: PolicyDataStepProps) {
  const [clientType, setClientType] = useState<ClientType>("person")
  const [multiplier, setMultiplier] = useState(1)

  // Life policy state
  const [lifePolicyData, setLifePolicyData] = useState<LifePolicyData>({
    certPresented: "",
    certData: "",
  })

  // Home policy state
  const [homePolicyData, setHomePolicyData] = useState<HomePolicyData>({
    constructionType: "Brick",
    buildingAge: 0,
    city: "",
    neighborhood: "",
  })

  // Vehicle policy state
  const [vehiclePolicyData, setVehiclePolicyData] = useState<VehiclePolicyData>({
    vehicleYear: new Date().getFullYear(),
    vehicleModel: "",
    vehicleTheftRisk: "low",
    driverViolations: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let data: LifePolicyData | HomePolicyData | VehiclePolicyData

    if (insuranceType === "life") {
      data = lifePolicyData
    } else if (insuranceType === "home") {
      data = homePolicyData
    } else {
      data = vehiclePolicyData
    }

    onSubmit(data, clientType, multiplier)
  }

  const getTitle = () => {
    switch (insuranceType) {
      case "life":
        return "Datos del Seguro de Vida"
      case "home":
        return "Datos del Seguro de Hogar"
      case "vehicle":
        return "Datos del Seguro de Auto"
      default:
        return "Datos de la Póliza"
    }
  }

  return (
    <Card className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{getTitle()}</h2>
          <p className="text-muted-foreground">Completa la información requerida</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">      
        {/* Life Policy Fields */}
        {insuranceType === "life" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certPresented" className="text-foreground">
                Certificado Presentado
              </Label>
              <Input
                id="certPresented"
                value={lifePolicyData.certPresented}
                onChange={(e) =>
                  setLifePolicyData({
                    ...lifePolicyData,
                    certPresented: e.target.value,
                  })
                }
                placeholder="Número de certificado"
                required
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certData" className="text-foreground">
                Datos del Certificado
              </Label>
              <Input
                id="certData"
                value={lifePolicyData.certData}
                onChange={(e) =>
                  setLifePolicyData({
                    ...lifePolicyData,
                    certData: e.target.value,
                  })
                }
                placeholder="Información adicional del certificado"
                required
                className="bg-card"
              />
            </div>
          </div>
        )}

        {/* Home Policy Fields */}
        {insuranceType === "home" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="constructionType" className="text-foreground">
                Tipo de Construcción
              </Label>
              <Select
                value={homePolicyData.constructionType}
                onValueChange={(value: "Brick" | "Concrete" | "Wood" | "Mixed") =>
                  setHomePolicyData({ ...homePolicyData, constructionType: value })
                }
              >
                <SelectTrigger id="constructionType" className="bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brick">Ladrillo</SelectItem>
                  <SelectItem value="Concrete">Concreto</SelectItem>
                  <SelectItem value="Wood">Madera</SelectItem>
                  <SelectItem value="Mixed">Mixto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buildingAge" className="text-foreground">
                Antigüedad del Edificio (años)
              </Label>
              <Input
                id="buildingAge"
                type="number"
                min="0"
                value={homePolicyData.buildingAge}
                onChange={(e) =>
                  setHomePolicyData({
                    ...homePolicyData,
                    buildingAge: Number.parseInt(e.target.value),
                  })
                }
                required
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-foreground">
                Ciudad
              </Label>
              <Input
                id="city"
                value={homePolicyData.city}
                onChange={(e) => setHomePolicyData({ ...homePolicyData, city: e.target.value })}
                placeholder="Ciudad donde se ubica la propiedad"
                required
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood" className="text-foreground">
                Barrio
              </Label>
              <Input
                id="neighborhood"
                value={homePolicyData.neighborhood}
                onChange={(e) =>
                  setHomePolicyData({
                    ...homePolicyData,
                    neighborhood: e.target.value,
                  })
                }
                placeholder="Barrio o zona"
                required
                className="bg-card"
              />
            </div>
          </div>
        )}

        {/* Vehicle Policy Fields */}
        {insuranceType === "vehicle" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleYear" className="text-foreground">
                Año del Vehículo
              </Label>
              <Input
                id="vehicleYear"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={vehiclePolicyData.vehicleYear}
                onChange={(e) =>
                  setVehiclePolicyData({
                    ...vehiclePolicyData,
                    vehicleYear: Number.parseInt(e.target.value),
                  })
                }
                required
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleModel" className="text-foreground">
                Modelo del Vehículo
              </Label>
              <Input
                id="vehicleModel"
                value={vehiclePolicyData.vehicleModel}
                onChange={(e) =>
                  setVehiclePolicyData({
                    ...vehiclePolicyData,
                    vehicleModel: e.target.value,
                  })
                }
                placeholder="Marca y modelo"
                required
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleTheftRisk" className="text-foreground">
                Riesgo de Robo
              </Label>
              <Select
                value={vehiclePolicyData.vehicleTheftRisk}
                onValueChange={(value) =>
                  setVehiclePolicyData({
                    ...vehiclePolicyData,
                    vehicleTheftRisk: value,
                  })
                }
              >
                <SelectTrigger id="vehicleTheftRisk" className="bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Bajo</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverViolations" className="text-foreground">
                Infracciones del Conductor
              </Label>
              <Input
                id="driverViolations"
                type="number"
                min="0"
                value={vehiclePolicyData.driverViolations}
                onChange={(e) =>
                  setVehiclePolicyData({
                    ...vehiclePolicyData,
                    driverViolations: Number.parseInt(e.target.value),
                  })
                }
                required
                className="bg-card"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="border-border bg-transparent">
            Atrás
          </Button>
          <Button type="submit" className="bg-red-500 text-white hover:bg-red-600">
            Siguiente
          </Button>
        </div>
      </form>
    </Card>
  )
}
