import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Obtener todos los eventos
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("policy_event")
      .select(`
        *,
        policy:contracted_policy(*)
      `)
      .order("request_date", { ascending: false })

    if (error) {
      console.error("[API] Error fetching events:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[API] Error in GET /api/events:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear un nuevo evento
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { policy_id, event_type, description, status } = body

    // Validación básica
    if (!policy_id || !event_type || !description) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: policy_id, event_type, description" },
        { status: 400 }
      )
    }

    // Crear el evento
    const { data, error } = await supabase
      .from("policy_event")
      .insert([
        {
          policy_id,
          event_type,
          description,
          status: status || "pendiente",
          request_date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD para type date
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[API] Error creating event:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[API] Error in POST /api/events:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}