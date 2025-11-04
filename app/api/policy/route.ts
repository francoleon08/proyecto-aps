import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Query para life_policy con JOIN
    const { data: life, error: life_error } = await supabase.from('life_policy').select(`
      *,
      contracted_policy!inner(
        users!inner(name)
      ).users.name
    `)

    // Query para home_policy con JOIN
    const { data: home, error: home_error } = await supabase.from('home_policy').select(`
      *,
      contracted_policy!inner(
        users!inner(name)
      ).users.name
    `)

    // Query para vehicle_policy con JOIN
    const { data: vehicle, error: vehicle_error } = await supabase.from('vehicle_policy').select(`
      *,
      contracted_policy!inner(
        users!inner(name)
      ).users.name
    `)

    if (life_error || home_error || vehicle_error) {
      console.error('Error fetching policies:', {
        life_error,
        home_error,
        vehicle_error,
      })
      return NextResponse.json({ error: 'Error al obtener las pólizas' }, { status: 404 })
    }

    // Transformar los datos para incluir user_name directamente y eliminar contracted_policy
    const transformedLife = life?.map((policy: any) => {
      const { contracted_policy, ...rest } = policy
      return {
        ...rest,
        user_name: contracted_policy?.users?.name || 'N/A',
      }
    })

    const transformedHome = home?.map((policy: any) => {
      const { contracted_policy, ...rest } = policy
      return {
        ...rest,
        user_name: contracted_policy?.users?.name || 'N/A',
      }
    })

    const transformedVehicle = vehicle?.map((policy: any) => {
      const { contracted_policy, ...rest } = policy
      return {
        ...rest,
        user_name: contracted_policy?.users?.name || 'N/A',
      }
    })

    const combinedPolicies = {
      life_policy: transformedLife,
      home_policy: transformedHome,
      vehicle_policy: transformedVehicle,
    }

    return NextResponse.json(combinedPolicies)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
