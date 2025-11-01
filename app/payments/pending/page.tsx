'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PendingPage() {
  const searchParams = useSearchParams()
  const couponId = searchParams.get('coupon_id') || 'CUP-20250101-XXXX'
  const amount = searchParams.get('amount') || '0'
  const date = searchParams.get('date') || new Date().toLocaleDateString('es-ES')
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg border border-amber-200 p-8 text-center space-y-6">
          {/* Loading Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center relative">
              <svg
                className="w-8 h-8 text-amber-600 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Pago Pendiente</h1>
            <p className="text-slate-600">Estamos procesando tu compra...</p>
          </div>

          {/* Details */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">ID de Cupón</span>
              <span className="text-sm font-mono font-semibold text-slate-900">{couponId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Monto</span>
              <span className="text-sm font-semibold text-amber-600">${amount} ARS</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Fecha</span>
              <span className="text-sm text-slate-900">{date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Tiempo Transcurrido</span>
              <span className="text-sm font-semibold text-amber-600">{seconds}s</span>
            </div>
          </div>

          {/* Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Por favor no cierres esta página. Tu pago se completará automáticamente en unos momentos.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Link href="/payments">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
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

          {/* Status */}
          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-600">
              Estado: <span className="font-semibold text-amber-600">En Procesamiento</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
