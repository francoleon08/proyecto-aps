'use client'

import { getStateBadge } from '@/app/requests/page'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Calendar, User, FileText } from 'lucide-react'
import type { Request } from '@/types/custom'

interface RequestListProps {
  requests: Request[]
  onView?: (solicitud: Request) => void
}

export function RequestList({ requests, onView }: RequestListProps) {
  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <Card key={request.id} className="overflow-hidden transition-shadow hover:shadow-md">
          <div className="flex items-center gap-6 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Solicitud #{request.id}</h3>
                    {getStateBadge(request.state)}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{request.event}</p>
                </div>
                <Button onClick={() => onView && onView(request)} variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Ver detalle
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{request.client}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(request.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {request.amount && <div className="ml-auto font-semibold text-foreground">{request.amount}</div>}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
