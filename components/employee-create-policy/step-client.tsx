'use client'

import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { User } from 'lucide-react'

interface Client {
  id: string
  name: string
}

interface SelectClientStepProps {
  onSelect: (clientId: string) => void
}

export function SelectClientStep({ onSelect }: SelectClientStepProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchClients() {
      try {
        const data = [
          { id: '1', name: 'Juan Pérez' },
          { id: '2', name: 'María Gómez' },
          { id: '3', name: 'Carlos Rodríguez' },
          { id: '4', name: 'Ana Fernández' },
          { id: '5', name: 'Luis Martínez' },
          { id: '6', name: 'Sofía López' },
          { id: '7', name: 'Miguel Torres' },
          { id: '8', name: 'Lucía Ramírez' },
          { id: '9', name: 'Diego Sánchez' },
          { id: '10', name: 'Elena Cruz' },
        ]
        setClients(data || [])
      } catch (err) {
        setError('Error al cargar los clientes')
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Seleccionar Cliente</h2>
      <p className="text-muted-foreground mb-6">Selecciona el cliente que deseas asegurar</p>

      <Input
        type="text"
        placeholder="Buscar cliente por nombre o email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && filteredClients.length === 0 && (
        <Alert>
          <AlertDescription>
            {searchTerm ? 'No se encontraron clientes con ese criterio de búsqueda' : 'No hay clientes disponibles'}
          </AlertDescription>
        </Alert>
      )}

      {!loading && !error && filteredClients.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-4 border rounded-lg hover:bg-accent hover:border-primary cursor-pointer transition-all duration-200 flex items-center gap-3"
              onClick={() => onSelect(client.id)}
            >
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-3 h-3 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">{client.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
