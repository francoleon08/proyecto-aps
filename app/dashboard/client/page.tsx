'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import UserCotizerPolicy from '@/components/user-cotizer-policy'
import { useRouter } from 'next/navigation'

export default function ClientDashboard() {
  const router = useRouter()
  const [showCotizerPolicy, setShowCotizerPolicy] = useState(false)

  if (showCotizerPolicy) {
    return (
      <DashboardLayout title="Gestión de Usuarios" description="Administrar usuarios del sistema">
        <UserCotizerPolicy onBack={() => setShowCotizerPolicy(false)} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Dashboard Cliente" description="Panel de control para clientes">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">¡Bienvenido!</h4>
          <p className="text-sm text-gray-600 mb-6">
            Desde este panel puedes gestionar tus pólizas, ver reclamos y actualizar tu información.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setShowCotizerPolicy(!showCotizerPolicy)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cotizar Poliza
            </button>
            <button
              onClick={() => router.push('/payments')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Pagar Pólizas Pendientes
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Ver Polizas Activas
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Ver Reclamos
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Actualizar Información
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
