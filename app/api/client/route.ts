import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from('users').select('*').eq('user_type', 'client')

    if (error) {
      console.error('Error fetching clients:', error)
      return NextResponse.json({ error: 'Error al obtener los clientes' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
