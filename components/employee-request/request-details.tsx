'use client'

import { getStateBadge } from '@/app/requests/page'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, CheckCircle, XCircle, User, Calendar, FileText, DollarSign } from 'lucide-react'
import type { Request } from '@/types/custom'

interface RequestDetailsProps {
  request: Request
  onClose?: () => void
  onApprove?: () => void
  onReject?: () => void
}

export function RequestDetails({ request, onClose, onApprove, onReject }: RequestDetailsProps) {
  const isPending = request.state === 'pendiente'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Detalle de Solicitud</h2>
            {getStateBadge(request.state)}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Número de solicitud</span>
              </div>
              <p className="text-lg font-semibold">#{request.id}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Cliente</span>
              </div>
              <p className="text-lg font-semibold">{request.client}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Fecha de creación</span>
              </div>
              <p className="text-lg font-semibold">
                {new Date(request.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {request.amount && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Monto estimado</span>
                </div>
                <p className="text-lg font-semibold">{request.amount}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Tipo de evento</h3>
            <p className="rounded-lg bg-muted p-3 text-sm">{request.event}</p>
          </div>

          {request.description && (
            <div className="space-y-2">
              <h3 className="font-semibold">Descripción del incidente</h3>
              <p className="rounded-lg bg-muted p-3 text-sm leading-relaxed">{request.description}</p>
            </div>
          )}
        </div>

        {isPending && (
          <div className="flex gap-3 border-t bg-muted/30 p-6">
            <Button
              onClick={onReject}
              variant="outline"
              className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
            >
              <XCircle className="h-4 w-4" />
              Rechazar solicitud
            </Button>
            <Button onClick={onApprove} className="flex-1 gap-2 bg-success hover:bg-success/90 text-success-foreground">
              <CheckCircle className="h-4 w-4" />
              Aprobar solicitud
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
