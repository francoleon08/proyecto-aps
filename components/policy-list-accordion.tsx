'use client'

import { useState, ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export interface PolicyListAccordionProps<T> {
  title: string
  policies: T[]
  renderPolicy: (policy: T) => ReactNode
  onPolicyClick: (policy: T) => void
  getPolicyId: (policy: T) => string
  defaultOpen?: boolean
  emptyMessage?: string
}

export function PolicyListAccordion<T>({
  title,
  policies,
  renderPolicy,
  onPolicyClick,
  getPolicyId,
  defaultOpen = false,
  emptyMessage = 'No hay pólizas disponibles',
}: PolicyListAccordionProps<T>) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      {/* Header del acordeón */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {policies.length}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Contenido del acordeón */}
      {isOpen && (
        <div className="bg-white">
          {policies.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">{emptyMessage}</div>
          ) : (
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Detalles de la Póliza
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {policies.map((policy) => (
                    <tr
                      key={getPolicyId(policy)}
                      onClick={() => onPolicyClick(policy)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{renderPolicy(policy)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <svg
                          className="h-5 w-5 text-gray-400 inline-block"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M9 5l7 7-7 7"></path>
                        </svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
