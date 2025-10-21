'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPlanById } from '@/actions/plans'
import { Tables } from '@/types/database'
import { DashboardLayout } from '@/components/dashboard-layout'
import { PlanForm } from '@/components/plan-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function EditPlanPage() {
  const { id } = useParams()
  const [plan, setPlan] = useState<Tables<'plans'>>()

  useEffect((): void => {
    if (id && typeof id === 'string') {
      getPlanById(id).then((data: Tables<'plans'> | null) => {
        if (data) setPlan(data)
      })
    }
  }, [id])

  if (!plan) return <></>
  else
    return (
      <DashboardLayout title={'Gestión de Planes'} description={'Administrar planes del sistema'}>
        <div className="p-8">
          <div className="mb-8">
            <Link href="/plans">
              <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a los Planes
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Editar el plan</h1>
            <p className="text-muted-foreground">Actualiza los detalles del plan de póliza</p>
          </div>

          <PlanForm initialData={plan} isEditing />
        </div>
      </DashboardLayout>
    )
}
