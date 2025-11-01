'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function FailurePage() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason') || 'error_generico'
  const couponId = searchParams.get('coupon_id')
  const amount = searchParams.get('amount')
  const date = searchParams.get('date')

  const errorMessages: Record<string, string> = {
    insufficient_funds: 'Fondos insuficientes en tu cuenta',
    card_declined: 'Tu tarjeta ha sido rechazada',
    expired_card: 'Tu tarjeta ha expirado',
    invalid_data: 'Los datos proporcionados no son válidos',
    timeout: 'La transacción ha superado el tiempo de espera',
    error_generico: 'Ha ocurrido un error procesando tu pago',
  }

  const errorMessage = errorMessages[reason] || errorMessages.error_generico

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg border border-red-200 p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Pago Rechazado</h1>
            <p className="text-slate-600">No pudimos procesar tu compra</p>
          </div>

          {/* Error Details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-900 font-medium">{errorMessage}</p>
          </div>

          {/* Transaction Details if available */}
          {(couponId || amount || date) && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
              {couponId && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">ID de Cupón</span>
                  <span className="font-mono font-semibold text-slate-900">{couponId}</span>
                </div>
              )}
              {amount && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Monto Intenta</span>
                  <span className="font-semibold text-slate-900">${amount} ARS</span>
                </div>
              )}
              {date && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Fecha</span>
                  <span className="text-slate-900">{date}</span>
                </div>
              )}
            </div>
          )}

          {/* Suggestion */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Sugerencia:</span> Verifica tu método de pago e intenta nuevamente, o
              contacta a tu banco si el problema persiste.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Link href="/payments">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Intentar de Nuevo
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-2 px-4 rounded-lg transition-colors bg-transparent"
              >
                Ir a Inicio
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-600">
              ¿Necesitas ayuda?{' '}
              <a href="#" className="text-red-600 hover:text-red-700 font-semibold">
                Contacta a Soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
