'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getPlanById } from '@/actions/plans'
import { Tables } from '@/types/database'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'

export default function ViewPlanPage() {
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{plan.category} Plan</h1>
                <p className="text-muted-foreground">Ver información detallada acerca de este plan de póliza</p>
              </div>
              <Link href={`/plans/${plan.id}/edit`}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar el plan
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Overview Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-card-foreground">Detalles del Plan</CardTitle>
                  <Badge
                    variant={plan.is_active ? 'default' : 'secondary'}
                    className={
                      plan.is_active ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground'
                    }
                  >
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Categoria</label>
                  <p className="text-lg font-semibold text-card-foreground mt-1">{plan.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Precio Base</label>
                  <p className="text-lg font-semibold text-card-foreground mt-1">
                    ${plan.base_price.toFixed(2)} / month
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cobertura General</label>
                  <p className="text-lg font-semibold text-card-foreground mt-1">${plan.general_coverage.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            {/* Coverage Descriptions */}
            {plan.description && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Descripciones de Cobertura</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Información detallada de cada cobertura
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      Cobertura Hogar
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {(plan.description as { home: string }).home}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      Cobertura Persona
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {(plan.description as { person: string }).person}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      Cobertura Auto
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {(plan.description as { vehicle: string }).vehicle}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Benefits */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Beneficios del Plan</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Beneficios adicionales incluidos en el plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {Array.isArray(plan.benefits) &&
                    (plan.benefits as string[]).map((benefit, index) => (
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
