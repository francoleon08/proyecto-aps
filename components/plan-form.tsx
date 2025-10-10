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
  const [basePrice, setBasePrice] = useState(initialData?.base_price?.toString() || '')
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
        toast.error('Invalid plan ID')
        setLoading(false)
        return
      }
      updatePlan(initialData.id, plan)
        .then(() => {
          toast.success('Plan updated successfully')
          router.push('/plans')
        })
        .catch((error) => {
          toast.error('There was an error updating the plan')
          console.error(error)
          setLoading(false)
        })
    } else {
      createPlan(plan)
        .then(() => {
          toast.success('Plan created successfully')
          router.push('/plans')
        })
        .catch((error) => {
          toast.error('There was an error creating the plan')
          console.error(error)
          setLoading(false)
        })
    }
  }

  const handleCancel = () => {
    router.push('/plans')
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Basic Information</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter the plan category and pricing details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-card-foreground">
              Category
            </Label>
            <Input
              id="category"
              placeholder="e.g., Premium, Elite, Basic"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-background border-input text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="general_coverage" className="text-card-foreground">
              General Coverage
            </Label>
            <Input
              id="general_coverage"
              type="number"
              placeholder="0.00"
              value={generalCoverage}
              onChange={(e) => setGeneralCoverage(Number(e.target.value))}
              className="bg-background border-input text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="basePrice" className="text-card-foreground">
              Base Price (per month)
            </Label>
            <Input
              id="basePrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="bg-background border-input text-foreground"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="active" className="text-card-foreground">
                Active Status
              </Label>
              <p className="text-sm text-muted-foreground">Make this plan available to customers</p>
            </div>
            <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardContent>
      </Card>

      {/* Coverage Descriptions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Coverage Descriptions</CardTitle>
          <CardDescription className="text-muted-foreground">
            Provide detailed descriptions for each coverage type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="homeDescription" className="text-card-foreground">
              Home Description
            </Label>
            <Textarea
              id="homeDescription"
              placeholder="Describe the home coverage details..."
              value={homeDescription}
              onChange={(e) => setHomeDescription(e.target.value)}
              rows={3}
              className="bg-background border-input text-foreground resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personDescription" className="text-card-foreground">
              Person Description
            </Label>
            <Textarea
              id="personDescription"
              placeholder="Describe the personal coverage details..."
              value={personDescription}
              onChange={(e) => setPersonDescription(e.target.value)}
              rows={3}
              className="bg-background border-input text-foreground resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleDescription" className="text-card-foreground">
              Vehicle Description
            </Label>
            <Textarea
              id="vehicleDescription"
              placeholder="Describe the vehicle coverage details..."
              value={vehicleDescription}
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
          <CardTitle className="text-card-foreground">Plan Benefits</CardTitle>
          <CardDescription className="text-muted-foreground">Add benefits included with this plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Enter a benefit..."
                value={benefit}
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
            Add Benefit
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={loading}
        >
          {isEditing ? 'Update Plan' : 'Create Plan'}
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="border-border text-foreground hover:bg-accent bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
