'use client'

import { AuthUser } from '@/lib/auth'

interface PaymentDataReadProps {
  user: AuthUser
  subscriptionsCount: number
}

export function PaymentDataRead({ user, subscriptionsCount }: PaymentDataReadProps) {
  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">ℹ️ Nota:</span> Los datos del pago no pueden modificarse. Contactá a soporte
          si necesitás actualizar esta información.
        </p>
      </div>

      {/* Read-Only Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Usuario</label>
          <input
            type="text"
            value={user.name}
            readOnly
            className="w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">ID de Usuario</label>
          <input
            type="text"
            value={user.id}
            readOnly
            className="w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Suscripciones Activas</label>
          <input
            type="text"
            value={subscriptionsCount}
            readOnly
            className="w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Creación</label>
          <input
            type="text"
            value={new Date(user.created_at).toLocaleDateString('es-ES')}
            readOnly
            className="w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  )
}
