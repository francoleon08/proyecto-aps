'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Subscription } from '@/types/custom'
import { AuthUser } from '@/lib/auth'
import { TablesInsert } from '@/types/database'

interface CouponGeneratorProps {
  subscriptions: Subscription[]
  user: AuthUser
  onCouponGenerate?: (coupon: TablesInsert<'payment_coupon'>) => void
}

export function CouponGenerator({ subscriptions, user, onCouponGenerate }: CouponGeneratorProps) {
  const [dueDate, setDueDate] = useState('')
  const [coupon, setCoupon] = useState<TablesInsert<'payment_coupon'> | null>(null)

  useEffect(() => {
    // Set due date to 15 days from today on component mount
    const today = new Date()
    const futureDate = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)
    const formattedDate = futureDate.toISOString().split('T')[0]
    setDueDate(formattedDate)
  }, [])

  const amount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0)

  const handleGenerateCoupon = () => {
    if (!dueDate || subscriptions.length === 0) {
      return
    }

    // Generate unique coupon code
    const code = `CUP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random()
      .toString(36)
      .slice(2, 4)
      .toUpperCase()}`

    const coupon: TablesInsert<'payment_coupon'> = {
      amount,
      code,
      due_date: dueDate,
      issue_date: new Date().toISOString(),
      period: 'monthly',
      //policy_id: ... fix this
      status: 'processing',
      policy_count: subscriptions.length,
    }

    setCoupon(coupon)
    onCouponGenerate && onCouponGenerate(coupon)
  }

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="space-y-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-2">
            Fecha de Vencimiento del Cupón
          </label>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-lg font-semibold text-blue-600">{new Date(dueDate).toLocaleDateString('es-ES')}</p>
            <p className="text-xs text-slate-600 mt-1">Generada automáticamente (15 días desde hoy)</p>
          </div>
        </div>

        {subscriptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Monto Total a Cobrar</label>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">${amount}</p>
              <p className="text-sm text-slate-600 mt-1">{subscriptions.length} suscripción(es) seleccionada(s)</p>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerateCoupon}
        disabled={!dueDate || subscriptions.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Generar Cupón
      </Button>

      {/* Generated Coupon Preview */}
      {coupon && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50 p-6">
          <div className="space-y-4">
            {/* Coupon Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-blue-200">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Cupón de Pago</p>
                <p className="text-lg font-bold text-slate-900">{coupon.code}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">${coupon.amount}</p>
                <p className="text-xs text-slate-600">ARS</p>
              </div>
            </div>

            {/* Coupon Details */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">Usuario</p>
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">Vencimiento</p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(coupon.due_date).toLocaleDateString('es-ES')}
                </p>
              </div>

              {/* Subscriptions Included with Codes */}
              <div className="col-span-2">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
                  Suscripciones Incluidas
                </p>
                <div className="space-y-2 bg-white p-3 rounded border border-slate-200">
                  {subscriptions.map((sub: Subscription) => (
                    <div key={sub.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700 font-medium">{sub.name}</span>
                        <span className="text-sm font-semibold text-slate-900">${sub.amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-mono">{sub.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t-2 border-blue-200 text-center">
              <p className="text-xs text-slate-600">
                Generado el {coupon.issue_date ? new Date(coupon.issue_date).toLocaleDateString('es-ES') : '(error)'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
