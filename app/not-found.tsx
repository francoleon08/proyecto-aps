'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-w from-[rgb(var(--background-start-rgb))] to-[rgb(var(--background-end-rgb))] px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-2">404</h1>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
        </div>
        <h2 className="text-3xl font-semibold text-foreground mb-4">Página no encontrada</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.back()} size="lg" className="gap-2">
            <ArrowLeft className="h-5 w-5" />
            Volver
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/" className="gap-2">
              <Home className="h-5 w-5" />
              Ir al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
