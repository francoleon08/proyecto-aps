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
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
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
          toast.success('Plan deleted successfully')
          router.refresh()
        } else toast.error('Cannot delete plan with active subscriptions')
      })
      .catch((error) => {
        console.error(error)
        toast.error('There was an error deleting the plan')
      })
  }

  if (!plans) return <></>
  else
    return (
      <DashboardLayout title={''} description={''}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Insurance Plans</h1>
              <p className="text-muted-foreground">Manage your global insurance plan offerings</p>
            </div>
            <Link href="/plans/new">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </Button>
            </Link>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">All Plans</CardTitle>
              <CardDescription className="text-muted-foreground">
                View and manage all insurance plans in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Category</TableHead>
                    <TableHead className="text-muted-foreground">Base Price</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
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
                            title="Delete Plan?"
                            description="Are you sure you want to delete this plan? This action cannot be undone."
                            confirmText="Delete"
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
