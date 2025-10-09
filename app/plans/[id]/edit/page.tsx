import { DashboardLayout } from '@/components/dashboard-layout'
import { PlanForm } from '@/components/plan-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Mock data for editing
const planData = {
  id: '1',
  category: 'Premium',
  homeDescription:
    'Comprehensive home coverage including natural disasters, theft, and structural damage up to $500,000.',
  personDescription:
    'Full medical coverage with dental and vision, including emergency services and specialist consultations.',
  vehicleDescription:
    'Complete vehicle protection covering collision, comprehensive, and liability with roadside assistance.',
  benefits: [
    '24/7 Customer Support',
    'Global Coverage',
    'No Deductible for Preventive Care',
    'Emergency Medical Evacuation',
    'Personal Liability Protection',
  ],
  basePrice: 299.99,
  active: true,
}

export default function EditPlanPage() {
  return (
    <DashboardLayout title={''} description={''}>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Plan</h1>
          <p className="text-muted-foreground">
            Update the details of this insurance plan
          </p>
        </div>

        <PlanForm initialData={planData} isEditing />
      </div>
    </DashboardLayout>
  )
}
