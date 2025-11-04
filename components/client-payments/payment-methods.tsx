'use client'

import { PaymentMethod } from '@/types/custom'

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'mercado-pago',
    name: 'Mercado Pago',
    description: 'Pago seguro con Mercado Pago',
    icon: '💳',
    is_available: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Transferencia con PayPal',
    icon: '🌐',
    is_available: false,
  },
  {
    id: 'bank-transfer',
    name: 'Transferencia Bancaria',
    description: 'Transferencia directa a cuenta bancaria',
    icon: '🏦',
    is_available: false,
  },
]

interface PaymentMethodsProps {
  selectedMethod: string | null
  onMethodSelect?: (methodId: string) => void
}

export function PaymentMethods({ selectedMethod, onMethodSelect }: PaymentMethodsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600 mb-4">Selecciona un método de pago para continuar</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            disabled={!method.is_available}
            key={method.id}
            onClick={() => onMethodSelect && onMethodSelect(method.name)}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
              selectedMethod === method.name
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-blue-300'
            } ${!method.is_available && 'opacity-70 cursor-not-allowed after:backdrop-blur-lg after:bg-white/60'}
            `}
          >
            {/* Selection Indicator */}
            {selectedMethod === method.name && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Icon */}
            <div className="text-3xl mb-3">{method.icon}</div>

            {/* Content */}
            <h3 className="font-semibold text-slate-900 mb-1">{method.name}</h3>
            <p className="text-xs text-slate-600">{method.description}</p>
          </button>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">
          <span className="font-semibold">🔒 Nota:</span> Los datos sensibles se gestionan directamente con el proveedor
          de pago. No se almacenan en nuestro servidor.
        </p>
      </div>

      {/* TODO Comment */}
      <p className="text-xs text-slate-500 italic mt-4">
        {/* TODO: Integrate payment gateways (Mercado Pago, PayPal, Bank Transfer) and send coupon data to external payment service */}
      </p>
    </div>
  )
}
