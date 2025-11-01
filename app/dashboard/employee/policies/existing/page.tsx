'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AlertTriangle } from 'lucide-react'

interface Policy {
  id: string
  name: string
}

export default function ExistingPoliciesPage() {
  const router = useRouter()
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch('/api/policy')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Error al cargar las pólizas')
        }

        setPolicies(result.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  const handlePolicyClick = (policyId: string) => {
    //TODO: Navegar a la página de detalles de la póliza
    toast.custom(() => (
      <div className="flex items-center gap-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow">
        <AlertTriangle className="w-5 h-5" />
        <span>Funcionalidad no implementada aún.</span>
      </div>
    ))
  }

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

        {!loading && !error && policies.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay pólizas disponibles</p>
          </div>
        )}

        {!loading && !error && policies.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nombre del Cliente
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID de Póliza
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {policies.map((policy) => (
                    <tr
                      key={policy.id}
                      onClick={() => handlePolicyClick(policy.id)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{policy.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <svg
                          className="h-5 w-5 text-gray-400 inline-block"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M9 5l7 7-7 7"></path>
                        </svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  )
}
