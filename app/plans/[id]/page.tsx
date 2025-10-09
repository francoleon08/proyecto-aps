import { DashboardLayout } from '@/components/dashboard-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'

// Mock data
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

export default function ViewPlanPage() {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {planData.category} Plan
              </h1>
              <p className="text-muted-foreground">
                View detailed information about this insurance plan
              </p>
            </div>
            <Link href={`/plans/${planData.id}/edit`}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Pencil className="h-4 w-4 mr-2" />
                Edit Plan
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Overview Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-card-foreground">
                  Plan Overview
                </CardTitle>
                <Badge
                  variant={planData.active ? 'default' : 'secondary'}
                  className={
                    planData.active
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {planData.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Category
                </label>
                <p className="text-lg font-semibold text-card-foreground mt-1">
                  {planData.category}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Base Price
                </label>
                <p className="text-lg font-semibold text-card-foreground mt-1">
                  ${planData.basePrice.toFixed(2)} / month
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Coverage Descriptions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Coverage Descriptions
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Detailed coverage information for each category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Home Coverage
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {planData.homeDescription}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Person Coverage
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {planData.personDescription}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Vehicle Coverage
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {planData.vehicleDescription}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Plan Benefits
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Additional benefits included with this plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {planData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span className="text-card-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
