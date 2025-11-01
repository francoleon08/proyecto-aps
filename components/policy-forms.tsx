'use client'

import { useState } from 'react'
import { LifePolicy, HomePolicy, VehiclePolicy } from '@/app/dashboard/employee/policies/existing/page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

interface LifePolicyFormProps {
  policy: LifePolicy
  onSave: (updatedPolicy: LifePolicy) => void
  onCancel: () => void
}

export function LifePolicyForm({ policy, onSave, onCancel }: LifePolicyFormProps) {
  const [formData, setFormData] = useState<LifePolicy>(policy)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implementar la llamada a la API para actualizar
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(formData)
      toast.success('Póliza de vida actualizada correctamente')
    } catch (error) {
      toast.error('Error al actualizar la póliza')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="id">ID de Póliza</Label>
        <Input id="id" value={formData.id} disabled className="bg-gray-50" />
      </div>

      <div>
        <Label htmlFor="cert_presented">¿Certificado Presentado?</Label>
        <select
          id="cert_presented"
          value={formData.cert_presented ? 'true' : 'false'}
          onChange={(e) => setFormData({ ...formData, cert_presented: e.target.value === 'true' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      <div>
        <Label htmlFor="cert_data">Datos del Certificado</Label>
        <Input
          id="cert_data"
          value={formData.cert_data}
          onChange={(e) => setFormData({ ...formData, cert_data: e.target.value })}
          placeholder="Ingrese los datos del certificado"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}

interface HomePolicyFormProps {
  policy: HomePolicy
  onSave: (updatedPolicy: HomePolicy) => void
  onCancel: () => void
}

export function HomePolicyForm({ policy, onSave, onCancel }: HomePolicyFormProps) {
  const [formData, setFormData] = useState<HomePolicy>(policy)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implementar la llamada a la API para actualizar
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(formData)
      toast.success('Póliza de hogar actualizada correctamente')
    } catch (error) {
      toast.error('Error al actualizar la póliza')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="id">ID de Póliza</Label>
        <Input id="id" value={formData.id} disabled className="bg-gray-50" />
      </div>

      <div>
        <Label htmlFor="construction_type">Tipo de Construcción</Label>
        <Input
          id="construction_type"
          value={formData.construction_type}
          onChange={(e) => setFormData({ ...formData, construction_type: e.target.value })}
          placeholder="Ej: Ladrillo, Madera, etc."
        />
      </div>

      <div>
        <Label htmlFor="building_age">Antigüedad del Edificio (años)</Label>
        <Input
          id="building_age"
          type="number"
          value={formData.building_age}
          onChange={(e) => setFormData({ ...formData, building_age: parseInt(e.target.value) || 0 })}
          placeholder="Ingrese la antigüedad"
        />
      </div>

      <div>
        <Label htmlFor="city">Ciudad</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          placeholder="Ingrese la ciudad"
        />
      </div>

      <div>
        <Label htmlFor="neighborhood">Barrio</Label>
        <Input
          id="neighborhood"
          value={formData.neighborhood}
          onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
          placeholder="Ingrese el barrio"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}

interface VehiclePolicyFormProps {
  policy: VehiclePolicy
  onSave: (updatedPolicy: VehiclePolicy) => void
  onCancel: () => void
}

export function VehiclePolicyForm({ policy, onSave, onCancel }: VehiclePolicyFormProps) {
  const [formData, setFormData] = useState<VehiclePolicy>(policy)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implementar la llamada a la API para actualizar
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(formData)
      toast.success('Póliza de vehículo actualizada correctamente')
    } catch (error) {
      toast.error('Error al actualizar la póliza')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="id">ID de Póliza</Label>
        <Input id="id" value={formData.id} disabled className="bg-gray-50" />
      </div>

      <div>
        <Label htmlFor="vehicle_year">Año del Vehículo</Label>
        <Input
          id="vehicle_year"
          type="number"
          value={formData.vehicle_year}
          onChange={(e) => setFormData({ ...formData, vehicle_year: parseInt(e.target.value) || 0 })}
          placeholder="Ej: 2020"
        />
      </div>

      <div>
        <Label htmlFor="vehicle_model">Modelo del Vehículo</Label>
        <Input
          id="vehicle_model"
          value={formData.vehicle_model}
          onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
          placeholder="Ej: Toyota Corolla"
        />
      </div>

      <div>
        <Label htmlFor="vehicle_theft_risk">Riesgo de Robo (1-10)</Label>
        <Input
          id="vehicle_theft_risk"
          type="number"
          min="1"
          max="10"
          value={formData.vehicle_theft_risk}
          onChange={(e) => setFormData({ ...formData, vehicle_theft_risk: parseInt(e.target.value) || 1 })}
          placeholder="Del 1 al 10"
        />
      </div>

      <div>
        <Label htmlFor="driver_violations">Infracciones del Conductor</Label>
        <Input
          id="driver_violations"
          type="number"
          min="0"
          value={formData.driver_violations}
          onChange={(e) => setFormData({ ...formData, driver_violations: parseInt(e.target.value) || 0 })}
          placeholder="Número de infracciones"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}
