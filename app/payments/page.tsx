'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { CouponGenerator } from '@/components/client-payments/coupon-generator'
import { PaymentMethods } from '@/components/client-payments/payment-methods'
import { SubscriptionSelector } from '@/components/client-payments/subscription-selector'
import { PaymentDataRead } from '@/components/client-payments/payment-data-read'
import { toast } from 'react-hot-toast'
import { Subscription } from '@/types/custom'
import { getUserSubscriptions } from '@/actions/payments'
import { clientSession } from '@/lib/session'
import { AuthUser } from '@/lib/auth'
import { TablesInsert } from '@/types/database'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/dashboard-layout'
import { processPreference } from '@/lib/payments'
import { useRouter } from 'next/navigation'

export default function PagosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [user, setUser] = useState<AuthUser | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [coupon, setCoupon] = useState<TablesInsert<'payment_coupon'> | null>(null)

  useEffect((): void => {
    clientSession.getCurrentUser().then((user: AuthUser | null): void => {
      setUser(user)
    })
  }, [])

  useEffect((): void => {
    if (user) {
      getUserSubscriptions(user.id).then((subscriptions: Subscription[]): void => {
        setSubscriptions(subscriptions)
        setLoading(false)
      })
    }
  }, [user])

  useEffect((): void => {
    subscriptions.forEach((subscription: Subscription): void => {
      subscription.coupon = coupon?.id
    })
  }, [coupon])

  const getSubscriptionsCount = (): number => {
    return subscriptions.filter((subscription: Subscription): boolean => subscription.selected).length
  }

  const handleSubscriptionToggle = (id: string) => {
    if (subscriptions) {
      setSubscriptions(subscriptions.map((sub) => (sub.id === id ? { ...sub, selected: !sub.selected } : sub)))
    }
  }

  const handleCouponGenerate = (coupon: any) => {
    setCoupon(coupon)
    toast.success('Cupón generado correctamente')
  }

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method)
  }
  const handleContinuePayment = async () => {
    if (processing || !coupon) return
    const filtered_subscriptions: Subscription[] = subscriptions.filter(
      (subscription: Subscription) => subscription.selected
    )
    setProcessing(true)
    processPreference(coupon, filtered_subscriptions)
      .then((init_point: string): void => {
        toast.success('Estás siendo redirigido al servicio de pago externo')
        setTimeout((): void => {
          router.push(init_point)
        }, 1000)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  if (!user) return <></>
  else
    return (
      <DashboardLayout title={'Gestión de Pagos'} description={'Paga tus pólizas desde tu casa'}>
        <div>
          <Link href="/dashboard/admin">
            <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
        {/* Main Content Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-${coupon ? 3 : 1} gap-8`}>
          {/* Left Column - All Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Payment Data - Read Only */}
            <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold mr-3">
                  1
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">Datos del Pago</h2>
              </div>
              <PaymentDataRead user={user} subscriptionsCount={subscriptions.length} />
            </section>

            {/* 2. Subscription Selection */}
            <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold mr-3">
                  2
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">Seleccionar Suscripciones</h2>
              </div>
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              ) : (
                <SubscriptionSelector subscriptions={subscriptions} onToggle={handleSubscriptionToggle} />
              )}
            </section>

            {/* 3. Coupon Generation */}
            <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold mr-3">
                  3
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">Generar Cupón</h2>
              </div>
              <CouponGenerator
                subscriptions={subscriptions.filter((s) => s.selected)}
                user={user}
                onCouponGenerate={handleCouponGenerate}
              />
            </section>

            {/* 4. Payment Methods */}
            <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold mr-3">
                  4
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">Seleccionar Método de Pago</h2>
              </div>
              <PaymentMethods selectedMethod={selectedPaymentMethod} onMethodSelect={handlePaymentMethodSelect} />
            </section>
          </div>

          {/* Right Column - Summary */}
          {coupon && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumen</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-slate-600">Monto Total</p>
                    <p className="text-2xl font-bold text-blue-600">${coupon.amount}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">Suscripciones</p>
                    <p className="text-sm font-medium text-slate-900">{getSubscriptionsCount()} plan(es)</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">Fecha de Vencimiento</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(coupon.due_date).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">ID del Cupón</p>
                    <p className="text-xs font-mono text-slate-700 break-all">{coupon.code}</p>
                  </div>

                  {selectedPaymentMethod && (
                    <div>
                      <p className="text-sm text-slate-600">Método Seleccionado</p>
                      <p className="text-sm font-medium text-slate-900">{selectedPaymentMethod}</p>
                    </div>
                  )}
                </div>

                <button
                  disabled={!selectedPaymentMethod || processing}
                  onClick={handleContinuePayment}
                  className="w-full bg-blue-600 disabled:bg-blue-400 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Continuar con el Pago
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    )
}
