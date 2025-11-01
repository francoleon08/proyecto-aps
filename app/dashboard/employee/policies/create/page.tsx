'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import EmployeeCotizerPolicy from '@/components/employee-create-policy/employee-cotizer-policy'
import { useRouter } from 'next/navigation'

export default function RegisterPolicyPage() {
  const router = useRouter()

  return (
    <DashboardLayout title="Dashboard Empleado" description="Panel de control para empleados">
      <EmployeeCotizerPolicy
        onBack={() => {
          router.push('/dashboard/employee')
        }}
      />
    </DashboardLayout>
  )
}
