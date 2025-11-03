'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { RequestList } from '@/components/employee-request/request-list'
import { RequestDetails } from '@/components/employee-request/request-details'
import { DecisionModal } from '@/components/decision-modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Request } from '@/types/custom'
import { REQUESTS_MOCK } from '@/lib/data'

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>(REQUESTS_MOCK)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [decisionType, setDecisionType] = useState<'aprobar' | 'rechazar'>('aprobar')

  const handleAprobar = () => {
    setDecisionType('aprobar')
    setShowDecisionModal(true)
  }

  const handleRechazar = () => {
    setDecisionType('rechazar')
    setShowDecisionModal(true)
  }

  const handleConfirm = (motivo?: string) => {
    if (!selectedRequest) return
    const nuevoEstado = decisionType === 'aprobar' ? 'aprobada' : 'rechazada'
    setRequests((prev) => prev.map((sol) => (sol.id === selectedRequest.id ? { ...sol, state: nuevoEstado } : sol)))
    setShowDecisionModal(false)
    setSelectedRequest(null)
    toast.success(`Solicitud ${nuevoEstado}. El cliente ${selectedRequest.client} ha sido notificado.`)
  }

  return (
    <DashboardLayout title={'Gestión de Solicitudes'} description={'Administrar las solicitudes sistema'}>
      <div className="p-8">
        <Link href="/dashboard/admin">
          <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Solicitudes</h2>
            <p className="text-muted-foreground">Revisa y gestiona las solicitudes de los clientes</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{requests.length}</span>
            <span>solicitudes totales</span>
          </div>
        </div>
        <RequestList requests={requests} onView={setSelectedRequest} />
        {selectedRequest && (
          <RequestDetails
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onApprove={handleAprobar}
            onReject={handleRechazar}
          />
        )}
        {showDecisionModal && (
          <DecisionModal
            type={decisionType}
            onConfirm={handleConfirm}
            onCancel={() => {
              setShowDecisionModal(false)
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

function getStateBadge(estado: Request['state']) {
  const variants = {
    pendiente: 'bg-[yellow] text-[black]',
    aprobada: 'bg-[green] text-[white]',
    rechazada: 'bg-[red] text-[white]',
  }
  const labels = {
    pendiente: 'Pendiente',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
  }
  return <Badge className={variants[estado]}>{labels[estado]}</Badge>
}
