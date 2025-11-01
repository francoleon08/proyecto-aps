'use client'

import { CheckCircle2 } from 'lucide-react'
import { Subscription } from '@/types/custom'

interface SubscriptionSelectorProps {
  subscriptions: Subscription[]
  onToggle?: (id: string) => void
}

export function SubscriptionSelector({ subscriptions, onToggle }: SubscriptionSelectorProps) {
  const totalAmount = subscriptions.filter((s) => s.selected).reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <span className="font-semibold">✓ Selecciona:</span> Marca las suscripciones que deseas incluir en el pago.
        </p>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-3">
        {subscriptions.map((subscription) => (
          <button
            disabled={subscription.paid}
            key={subscription.id}
            onClick={() => onToggle && onToggle(subscription.id)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              subscription.paid
                ? 'border-green-300 bg-green-50'
                : subscription.selected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-md border-2 mt-0.5 flex items-center justify-center transition-all ${
                  subscription.selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                }`}
              >
                {subscription.selected && !subscription.paid && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    subscription.paid ? 'text-green-700' : 'text-slate-900'
                  } flex items-center gap-2`}
                >
                  {subscription.name}
                  {subscription.paid && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </h3>
                <p className="text-sm text-slate-600">{subscription.type}</p>
                <p className="text-sm text-slate-600">Mensual</p>
              </div>

              {/* Amount */}
              <div className="flex-shrink-0 text-right">
                {subscription.paid ? (
                  <p className="text-green-600 font-medium text-sm bg-green-100 px-2 py-1 rounded-md inline-block">
                    Pagado
                  </p>
                ) : (
                  <>
                    <p className="text-lg font-bold text-blue-600">${subscription.amount}</p>
                    <p className="text-xs text-slate-500">$ARS</p>
                  </>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Total Amount */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Total Seleccionado:</span>
          <span className="text-2xl font-bold text-blue-600">${totalAmount}</span>
        </div>
        <p className="text-xs text-slate-500 mt-2"></p>
      </div>

      {subscriptions.filter((s) => s.selected).length === 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">⚠️ Selecciona al menos una suscripción para continuar.</p>
        </div>
      )}
    </div>
  )
}
