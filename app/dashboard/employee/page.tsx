"use client"

import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const router = useRouter();

  return (
    <DashboardLayout title="Dashboard Empleado" description="Panel de control para empleados">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Bienvenido, Empleado</h3>
        </div>
      </div>

      {/* Administrative Tools */}
      <div className="bg-white shadow rounded-lg p-6 mt-4">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Herramientas Administrativas</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/requests')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Gestionar Pedidos
          </button>
          <button
            onClick={() => router.push('/dashboard/employee/policies/existing')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Ver Pólizas Existentes
          </button>
          <button
            onClick={() => router.push('/dashboard/employee/policies/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Registrar Póliza
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
