import { DashboardLayout } from '@/components/dashboard-layout'
import { PlanForm } from '@/components/plan-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NewPlanPage() {
  return (
    <DashboardLayout title={'Gestión de Planes'} description={'Administrar planes del sistema'}>
      <div className="p-8">
        <div className="mb-8">
          <Link href="/plans">
            <Button
              variant="ghost"
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create New Plan
          </h1>
          <p className="text-muted-foreground">
            Add a new insurance plan to your offerings
          </p>
        </div>

        <PlanForm />
      </div>
    </DashboardLayout>
  )
}
