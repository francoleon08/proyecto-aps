'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  const router = useRouter()
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Acceso Denegado</h1>
        <p className="text-gray-700 mb-6">No tenés permisos para acceder a esta sección.</p>
        <Button onClick={() => router.back()} size="lg" className="gap-2">
          <ArrowLeft className="h-5 w-5" />
          Volver
        </Button>
      </div>
    </main>
  )
}
