import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from('contracted_policy').select(`
        id,
        users!inner (
          name
        )
      `)

    if (error) {
      console.error('Error fetching policies:', error)
      return NextResponse.json({ error: 'Error al obtener las pólizas' }, { status: 500 })
    }

    const formattedData = data?.map((policy: any) => ({
      id: policy.id,
      name: policy.users.name,
    }))

    return NextResponse.json({ data: formattedData })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
