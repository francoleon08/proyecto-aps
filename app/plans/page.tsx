'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deletePlan, getPlans } from '@/actions/plans'
import toast from 'react-hot-toast'
import { Tables } from '@/types/database'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Eye, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ConfirmDialog } from '@/components/confirm-dialog'

export default function PlansListPage() {
  const [plans, setPlans] = useState<Tables<'plans'>[]>()
  const router = useRouter()

  useEffect(() => {
    getPlans().then((data: Tables<'plans'>[]) => {
      setPlans(data)
    })
  }, [plans])

  function handleDelete(id: string) {
    deletePlan(id)
      .then((deleted) => {
        if (deleted) {
          toast.success('El plan ha sido eliminado correctamente')
          router.refresh()
        } else toast.error('No se puede eliminar el plan porque está siendo usado en una suscripción')
      })
      .catch((error) => {
        console.error(error)
        toast.error('Ocurrió un error eliminado el plan')
      })
  }

  if (!plans) return <></>
  else
    return (
      <DashboardLayout title={'Gestión de Planes'} description={'Administrar planes del sistema'}>
        <div className="p-8">
          <Link href="/dashboard/admin">
            <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Planes de Póliza</h1>
              <p className="text-muted-foreground">Administre los planes de póliza ofrecidos</p>
            </div>
            <Link href="/plans/new">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Plan
              </Button>
            </Link>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Todos los Planes</CardTitle>
              <CardDescription className="text-muted-foreground">
                Visualice y maneje todos sus planes de póliza en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Categoría</TableHead>
                    <TableHead className="text-muted-foreground">Precio Base</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-right text-muted-foreground">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id} className="border-border">
                      <TableCell className="font-medium text-card-foreground">{plan.category}</TableCell>
                      <TableCell className="text-card-foreground">${plan.base_price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={plan.is_active ? 'default' : 'secondary'}
                          className={
                            plan.is_active
                              ? 'bg-primary/10 text-primary border-primary/20 hover:text-secondary'
                              : 'bg-muted text-muted-foreground'
                          }
                        >
                          {plan.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/plans/${plan.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>
                          <Link href={`/plans/${plan.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <ConfirmDialog
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            }
                            title="¿Estas seguro de eliminar el plan? "
                            description="Esta acción no podrá ser revertida."
                            confirmText="Eliminar"
                            cancelText="Cancelar"
                            onConfirm={async () => handleDelete(plan.id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
}
