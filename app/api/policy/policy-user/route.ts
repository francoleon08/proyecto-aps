import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/session-server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Obtener el usuario autenticado usando tu sistema de sesión
    const user = getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener todas las pólizas contratadas del usuario
    const { data: contractedPolicies, error: contractedError } = await supabase
      .from('contracted_policy')
      .select('id, policy_number')
      .eq('user_id', user.id)

    if (contractedError) {
      console.error('Error fetching contracted policies:', contractedError)
      return NextResponse.json({ error: 'Error al obtener las pólizas' }, { status: 500 })
    }

    if (!contractedPolicies || contractedPolicies.length === 0) {
      return NextResponse.json([])
    }

    const policyIds = contractedPolicies.map((p) => p.id)

    // Buscar en las tres tablas específicas
    const [lifeRes, homeRes, vehicleRes] = await Promise.all([
      supabase.from('life_policy').select('id').in('id', policyIds),
      supabase.from('home_policy').select('id').in('id', policyIds),
      supabase.from('vehicle_policy').select('id').in('id', policyIds),
    ])

    // Mapear cada póliza con su tipo
    const policies = contractedPolicies.map((contracted) => {
        const id = String(contracted.id)

        const life = lifeRes.data?.find((p) => String(p.id) === id)
        const home = homeRes.data?.find((p) => String(p.id) === id)
        const vehicle = vehicleRes.data?.find((p) => String(p.id) === id)

        let type = 'Desconocido'
        let coverage_amount = null

        if (life) {
            type = 'Vida'
        } else if (home) {
            type = 'Hogar'
        } else if (vehicle) {
            type = 'Vehículo'
        }

        return {
            id,
            policy_number: contracted.policy_number?.toString() || 'N/A',
            type,
            coverage_amount,
        }
        })


    return NextResponse.json(policies)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}