'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { PolicyListAccordion } from '@/components/policy-list-accordion'
import { PolicyEditModal } from '@/components/policy-edit-modal'
import { LifePolicyForm, HomePolicyForm, VehiclePolicyForm } from '@/components/policy-forms'
import { useEffect, useState } from 'react'
import { Home, Car, Heart } from 'lucide-react'

export interface LifePolicy {
  id: string
  cert_presented: boolean
  cert_data: string
  user_name: string
}

export interface HomePolicy {
  id: string
  construction_type: string
  building_age: number
  city: string
  neighborhood: string
  user_name: string
}

export interface VehiclePolicy {
  id: string
  vehicle_year: number
  vehicle_model: string
  vehicle_theft_risk: number
  driver_violations: number
  user_name: string
}

type PolicyType = 'life' | 'home' | 'vehicle'

export default function ExistingPoliciesPage() {
  const [lifePolicies, setLifePolicies] = useState<LifePolicy[]>([])
  const [homePolicies, setHomePolicies] = useState<HomePolicy[]>([])
  const [vehiclePolicies, setVehiclePolicies] = useState<VehiclePolicy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado para el modal de edición
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPolicyType, setSelectedPolicyType] = useState<PolicyType | null>(null)
  const [selectedPolicy, setSelectedPolicy] = useState<LifePolicy | HomePolicy | VehiclePolicy | null>(null)

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch('/api/policy')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Error al cargar las pólizas')
        }

        setLifePolicies(result.life_policy || [])
        setHomePolicies(result.home_policy || [])
        setVehiclePolicies(result.vehicle_policy || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  const handleLifePolicyClick = (policy: LifePolicy) => {
    setSelectedPolicy(policy)
    setSelectedPolicyType('life')
    setIsModalOpen(true)
  }

  const handleHomePolicyClick = (policy: HomePolicy) => {
    setSelectedPolicy(policy)
    setSelectedPolicyType('home')
    setIsModalOpen(true)
  }

  const handleVehiclePolicyClick = (policy: VehiclePolicy) => {
    setSelectedPolicy(policy)
    setSelectedPolicyType('vehicle')
    setIsModalOpen(true)
  }

  const handleSavePolicy = (updatedPolicy: LifePolicy | HomePolicy | VehiclePolicy) => {
    if (selectedPolicyType === 'life') {
      setLifePolicies((prev) => prev.map((p) => (p.id === updatedPolicy.id ? (updatedPolicy as LifePolicy) : p)))
    } else if (selectedPolicyType === 'home') {
      setHomePolicies((prev) => prev.map((p) => (p.id === updatedPolicy.id ? (updatedPolicy as HomePolicy) : p)))
    } else if (selectedPolicyType === 'vehicle') {
      setVehiclePolicies((prev) => prev.map((p) => (p.id === updatedPolicy.id ? (updatedPolicy as VehiclePolicy) : p)))
    }
    setIsModalOpen(false)
    setSelectedPolicy(null)
    setSelectedPolicyType(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPolicy(null)
    setSelectedPolicyType(null)
  }

  const renderLifePolicy = (policy: LifePolicy) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-500" />
        <span className="font-medium">Cliente: {policy.user_name}</span>
      </div>
      <div className="text-sm text-gray-600">
        Certificado: {policy.cert_presented ? '✓ Presentado' : '✗ No presentado'}
      </div>
      {policy.cert_data && (
        <div className="text-sm text-gray-500">Datos: {parseCertData(policy.cert_data).certData}</div>
      )}
    </div>
  )

  const parseCertData = (certData: string) => {
    try {
      return JSON.parse(certData)
    } catch {
      return certData
    }
  }

  const renderHomePolicy = (policy: HomePolicy) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Home className="w-4 h-4 text-blue-500" />
        <span className="font-medium">Cliente: {policy.user_name}</span>
      </div>
      <div className="text-sm text-gray-600">
        {getConstructionType(policy.construction_type)} • {policy.building_age} años
      </div>
      <div className="text-sm text-gray-500">
        {policy.city}, {policy.neighborhood}
      </div>
    </div>
  )

  const getConstructionType = (constructionType: string) => {
    switch (constructionType) {
      case 'wood':
        return 'Madera'
      case 'brick':
        return 'Ladrillo'
      case 'concrete':
        return 'Concreto'
      default:
        return 'N/A'
    }
  }

  const renderVehiclePolicy = (policy: VehiclePolicy) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Car className="w-4 h-4 text-green-500" />
        <span className="font-medium">Cliente: {policy.user_name}</span>
      </div>
      <div className="text-sm text-gray-600">
        {policy.vehicle_model} ({policy.vehicle_year})
      </div>
      <div className="text-sm text-gray-500">
        Riesgo de robo: {policy.vehicle_theft_risk}/10 • Infracciones: {policy.driver_violations}
      </div>
    </div>
  )

  return (
    <DashboardLayout title="Dashboard Empleado" description="Panel de control para empleados">
      <main className="bg-white overflow-hidden shadow rounded-lg py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Pólizas Existentes</h1>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando pólizas...</p>
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {!loading && !error && (
          <div className="space-y-4">
            <PolicyListAccordion
              title="Pólizas de Vida"
              policies={lifePolicies}
              renderPolicy={renderLifePolicy}
              onPolicyClick={handleLifePolicyClick}
              getPolicyId={(policy) => policy.id}
              defaultOpen={true}
              emptyMessage="No hay pólizas de vida registradas"
            />

            <PolicyListAccordion
              title="Pólizas de Hogar"
              policies={homePolicies}
              renderPolicy={renderHomePolicy}
              onPolicyClick={handleHomePolicyClick}
              getPolicyId={(policy) => policy.id}
              defaultOpen={false}
              emptyMessage="No hay pólizas de hogar registradas"
            />

            <PolicyListAccordion
              title="Pólizas de Vehículo"
              policies={vehiclePolicies}
              renderPolicy={renderVehiclePolicy}
              onPolicyClick={handleVehiclePolicyClick}
              getPolicyId={(policy) => policy.id}
              defaultOpen={false}
              emptyMessage="No hay pólizas de vehículo registradas"
            />
          </div>
        )}

        {/* Modal de edición */}
        <PolicyEditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={
            selectedPolicyType === 'life'
              ? 'Editar Póliza de Vida'
              : selectedPolicyType === 'home'
                ? 'Editar Póliza de Hogar'
                : 'Editar Póliza de Vehículo'
          }
        >
          {selectedPolicyType === 'life' && selectedPolicy && (
            <LifePolicyForm
              policy={selectedPolicy as LifePolicy}
              onSave={handleSavePolicy}
              onCancel={handleCloseModal}
            />
          )}
          {selectedPolicyType === 'home' && selectedPolicy && (
            <HomePolicyForm
              policy={selectedPolicy as HomePolicy}
              onSave={handleSavePolicy}
              onCancel={handleCloseModal}
            />
          )}
          {selectedPolicyType === 'vehicle' && selectedPolicy && (
            <VehiclePolicyForm
              policy={selectedPolicy as VehiclePolicy}
              onSave={handleSavePolicy}
              onCancel={handleCloseModal}
            />
          )}
        </PolicyEditModal>
      </main>
    </DashboardLayout>
  )
}
