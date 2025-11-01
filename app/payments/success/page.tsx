'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const couponId = searchParams.get('coupon_id') || 'CUP-20250101-XXXX'
  const amount = searchParams.get('amount') || '7500'
  const date = searchParams.get('date') || new Date().toLocaleDateString('es-ES')

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg border border-green-200 p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">¡Pago Exitoso!</h1>
            <p className="text-slate-600">Tu compra se ha procesado correctamente</p>
          </div>

          {/* Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">ID de Cupón</span>
              <span className="text-sm font-mono font-semibold text-slate-900">{couponId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Monto Pagado</span>
              <span className="text-sm font-semibold text-green-600">${amount} ARS</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Fecha</span>
              <span className="text-sm text-slate-900">{date}</span>
            </div>
          </div>

          {/* Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Se ha enviado un comprobante de pago a tu correo electrónico. Conservalo para tus registros.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Link href="/payments">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Volver a Pagos
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
        </div>
      </div>
    </main>
  )
}
