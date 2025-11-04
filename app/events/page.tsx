"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { Download, FileText } from "lucide-react"

interface Policy {
  id: string
  type: string
  policy_number?: string
  coverage_amount?: number
}

interface PolicyEvent {
  id: string
  policy_id: string
  request_date: string
  event_type: string
  description: string
  status: string
  resolution_date: string | null
  policy?: Policy
}

const EVENT_TYPES = [
  { value: "siniestro", label: "Siniestro" },
  { value: "robo", label: "Robo" },
  { value: "incendio", label: "Incendio" },
  { value: "dano", label: "Daño" },
  { value: "otro", label: "Otro" },
]

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
  en_proceso: { label: "En Proceso", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  resuelto: { label: "Resuelto", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  rechazado: { label: "Rechazado", className: "bg-red-100 text-red-800 hover:bg-red-100" },
}

export default function EventsPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [events, setEvents] = useState<PolicyEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Form state
  const [selectedPolicyId, setSelectedPolicyId] = useState("")
  const [selectedEventType, setSelectedEventType] = useState("")
  const [description, setDescription] = useState("")

  // Fetch policies and events
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [policiesRes, eventsRes] = await Promise.all([fetch("/api/policy"), fetch("/api/events")])

      if (policiesRes.ok) {
        const policiesData = await policiesRes.json()
        setPolicies(policiesData)
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json()
        setEvents(eventsData)
      }
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPolicyId || !selectedEventType || !description.trim()) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          policy_id: selectedPolicyId,
          event_type: selectedEventType,
          description: description.trim(),
          status: "pendiente",
        }),
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Evento registrado correctamente",
        })
        // Reset form
        setSelectedPolicyId("")
        setSelectedEventType("")
        setDescription("")
        // Refresh events list
        await fetchData()
      } else {
        throw new Error("Error al crear el evento")
      }
    } catch (error) {
      console.error("[v0] Error submitting event:", error)
      toast({
        title: "Error",
        description: "No se pudo registrar el evento",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const downloadEventSummary = (event: PolicyEvent) => {
    const policy = policies.find((p) => p.id === event.policy_id)
    const eventTypeLabel = EVENT_TYPES.find((t) => t.value === event.event_type)?.label || event.event_type
    const statusLabel = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG]?.label || event.status

    const summary = `
RESUMEN DE EVENTO DE INTERÉS
============================

Fecha de solicitud: ${new Date(event.request_date).toLocaleDateString("es-ES")}
Tipo de evento: ${eventTypeLabel}
Estado: ${statusLabel}
${event.resolution_date ? `Fecha de resolución: ${new Date(event.resolution_date).toLocaleDateString("es-ES")}` : ""}

PÓLIZA ASOCIADA
---------------
Número de póliza: ${policy?.policy_number || "N/A"}
Tipo: ${policy?.type || "N/A"}
${policy?.coverage_amount ? `Cobertura: $${policy.coverage_amount.toLocaleString("es-ES")}` : ""}

DESCRIPCIÓN DEL EVENTO
----------------------
${event.description}

============================
Generado el: ${new Date().toLocaleString("es-ES")}
    `.trim()

    const blob = new Blob([summary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `evento-${event.id.slice(0, 8)}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Descarga iniciada",
      description: "El resumen se está descargando",
    })
  }

  return (
    <DashboardLayout
      title="Gestión de Eventos"
      description="Solicite y gestione eventos de interés relacionados con sus pólizas"
    >
      <div className="space-y-8">
        {/* Events Table */}
        <Card className="bg-white p-6 rounded-xl shadow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Eventos solicitados</h2>
            <p className="text-sm text-muted-foreground">Historial de todos sus eventos registrados</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay eventos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de evento</TableHead>
                    <TableHead>Póliza</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de solicitud</TableHead>
                    <TableHead>Fecha de resolución</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => {
                    const policy = policies.find((p) => p.id === event.policy_id)
                    const eventTypeLabel =
                      EVENT_TYPES.find((t) => t.value === event.event_type)?.label || event.event_type
                    const statusConfig = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG] || {
                      label: event.status,
                      className: "bg-gray-100 text-gray-800",
                    }

                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{eventTypeLabel}</TableCell>
                        <TableCell>{policy?.policy_number || policy?.type || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusConfig.className}>
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(event.request_date).toLocaleDateString("es-ES")}</TableCell>
                        <TableCell>
                          {event.resolution_date ? new Date(event.resolution_date).toLocaleDateString("es-ES") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadEventSummary(event)}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Descargar resumen
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* New Event Form */}
        <Card className="bg-white p-6 rounded-xl shadow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Solicitar nuevo evento</h2>
            <p className="text-sm text-muted-foreground">Complete el formulario para registrar un nuevo evento</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="policy">Póliza asociada *</Label>
              <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId}>
                <SelectTrigger id="policy">
                  <SelectValue placeholder="Seleccione una póliza" />
                </SelectTrigger>
                <SelectContent>
                  {policies.map((policy) => (
                    <SelectItem key={policy.id} value={policy.id}>
                      {policy.policy_number || policy.type} - {policy.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-type">Tipo de evento *</Label>
              <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Seleccione el tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                placeholder="Describa el evento en detalle..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !selectedPolicyId || !selectedEventType || !description.trim()}
              className="bg-primary text-white hover:bg-primary/90 rounded-lg px-4 py-2"
            >
              {submitting ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Enviando...
                </>
              ) : (
                "Enviar solicitud"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
