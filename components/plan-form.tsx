'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPlan, updatePlan } from '@/actions/plans'
import toast from 'react-hot-toast'
import { Tables } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Plus, X } from 'lucide-react'

interface PlanFormProps {
  initialData?: Tables<'plans'>
  isEditing?: boolean
}

export function PlanForm({ initialData, isEditing = false }: PlanFormProps) {
  const router = useRouter()
  const [category, setCategory] = useState(initialData?.category || '')
  const [generalCoverage, setGeneralCoverage] = useState(initialData?.general_coverage || 0)
  const [homeDescription, setHomeDescription] = useState(
    (initialData && (initialData?.description as { home: string }).home) || ''
  )
  const [personDescription, setPersonDescription] = useState(
    (initialData && (initialData?.description as { person: string }).person) || ''
  )
  const [vehicleDescription, setVehicleDescription] = useState(
    (initialData && (initialData?.description as { vehicle: string }).vehicle) || ''
  )
  const [benefits, setBenefits] = useState<string[]>((initialData && (initialData?.benefits as string[])) || [''])
  const [basePrice, setBasePrice] = useState(initialData?.base_price?.toString() || '0')
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [loading, setLoading] = useState(false)

  const addBenefit = () => {
    setBenefits([...benefits, ''])
  }

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...benefits]
    newBenefits[index] = value
    setBenefits(newBenefits)
  }

  const handleSave = () => {
    if (loading) return
    setLoading(true)
    const plan = {
      category,
      description: {
        home: homeDescription,
        person: personDescription,
        vehicle: vehicleDescription,
      },
      benefits: benefits.filter((b) => b.trim() !== ''),
      base_price: Number.parseFloat(basePrice),
      is_active: isActive,
      general_coverage: generalCoverage,
    }
    if (isEditing) {
      if (!initialData?.id) {
        toast.error('El id del plan es inválido')
        setLoading(false)
        return
      }
      updatePlan(initialData.id, plan)
        .then(() => {
          toast.success('El plan ha sido actualizado correctamente')
          router.push('/plans')
        })
        .catch((error) => {
          toast.error('Ocurrió un error actualizando los datos del plan')
          console.error(error)
          setLoading(false)
        })
    } else {
      createPlan(plan)
        .then(() => {
          toast.success('El plan ha sido creado correctamente')
          router.push('/plans')
        })
        .catch((error) => {
          toast.error('Ocurrió un error creando el plan')
          console.error(error)
          setLoading(false)
        })
    }
  }

  const handleCancel = () => {
    router.push('/plans')
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        handleSave()
      }}
    >
      {/* Basic Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Información Básica</CardTitle>
          <CardDescription className="text-muted-foreground">
            Cargar la categoria y los precios del plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-card-foreground">
              Categoria
            </Label>
            <Input
              id="category"
              placeholder="e.g., Premium, Elite, Basic"
              value={category}
              required
              onChange={(e) => setCategory(e.target.value)}
              className="bg-background border-input text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="general_coverage" className="text-card-foreground">
              Cobertura General
            </Label>
            <Input
              id="general_coverage"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={generalCoverage}
              min="0"
              required
              onChange={(e) => setGeneralCoverage(Number(e.target.value))}
              className="bg-background border-input text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="basePrice" className="text-card-foreground">
              Precio Base (por mes)
            </Label>
            <Input
              id="basePrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={basePrice || 0}
              min="0"
              required
              onChange={(e) => setBasePrice(e.target.value)}
              className="bg-background border-input text-foreground"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="active" className="text-card-foreground">
                Estado Activo
              </Label>
              <p className="text-sm text-muted-foreground">Habilita este plan para los clientes</p>
            </div>
            <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardContent>
      </Card>

      {/* Coverage Descriptions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Descripción de Coberturas</CardTitle>
          <CardDescription className="text-muted-foreground">
            Cargar descripciones detalladas para cada tipo de cobertura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="homeDescription" className="text-card-foreground">
              Descripción para Hogares
            </Label>
            <Textarea
              id="homeDescription"
              placeholder="Describe los detalles de la cobertura para hogares..."
              value={homeDescription}
              required
              onChange={(e) => setHomeDescription(e.target.value)}
              rows={3}
              className="bg-background border-input text-foreground resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personDescription" className="text-card-foreground">
              Descripción para Personas
            </Label>
            <Textarea
              id="personDescription"
              placeholder="Describe los detalles de la cobertura para personas..."
              value={personDescription}
              required
              onChange={(e) => setPersonDescription(e.target.value)}
              rows={3}
              className="bg-background border-input text-foreground resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleDescription" className="text-card-foreground">
              Descripción para Autos
            </Label>
            <Textarea
              id="vehicleDescription"
              placeholder="Describe los deatlles de la cobertura para autos..."
              value={vehicleDescription}
              required
              onChange={(e) => setVehicleDescription(e.target.value)}
              rows={3}
              className="bg-background border-input text-foreground resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Beneficios del Plan</CardTitle>
          <CardDescription className="text-muted-foreground">
            Agregar los beneficios incluidos en el plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Ingresa un beneficio..."
                value={benefit}
                required
                onChange={(e) => updateBenefit(index, e.target.value)}
                className="bg-background border-input text-foreground"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeBenefit(index)}
                className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={benefits.length === 1}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove benefit</span>
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBenefit}
            className="w-full border-border text-foreground hover:bg-accent bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Beneficio
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
          {isEditing ? 'Actualizar Plan' : 'Crear Plan'}
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="border-border text-foreground hover:bg-accent bg-transparent"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
