import { NextResponse } from 'next/server'
import { getActivePlans } from '@/actions/plans'

export async function GET() {
  try {
    const plans = await getActivePlans()
    return NextResponse.json(plans)
  } catch (error) {
    console.error('[GET /api/plans/active] Error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
