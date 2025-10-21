'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface DecisionModalProps {
  type: 'aprobar' | 'rechazar'
  onConfirm?: (motivo?: string) => void
  onCancel?: () => void
}

export function DecisionModal({ type, onConfirm, onCancel }: DecisionModalProps) {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    if (type === 'rechazar' && !reason.trim()) return
    if (onConfirm) onConfirm(reason)
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
  }

  const isApprove = type === 'aprobar'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <div className="space-y-6 p-6">
          <div className="flex items-start gap-4">
            {isApprove ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{isApprove ? 'Aprobar solicitud' : 'Rechazar solicitud'}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isApprove
                  ? '¿Estás seguro de que deseas aprobar esta solicitud?'
                  : 'Por favor, proporciona un reason para el rechazo.'}
              </p>
            </div>
          </div>

          {!isApprove && (
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo del rechazo *</Label>
              <Textarea
                id="motivo"
                placeholder="Describe el motivo del rechazo..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              {!reason.trim() && (
                <p className="text-xs text-muted-foreground">El motivo es obligatorio para rechazar una solicitud</p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isApprove && !reason.trim()}
              className={
                isApprove
                  ? 'flex-1 bg-success hover:bg-success/90 text-success-foreground'
                  : 'flex-1 bg-destructive hover:bg-destructive/90'
              }
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
