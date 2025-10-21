import { NextResponse } from 'next/server'
import { getBasePrices } from '@/actions/plans'

export async function GET() {
  try {
    const basePrices = await getBasePrices()
    return NextResponse.json(basePrices)
  } catch (error) {
    console.error('[GET /api/plans/base-prices] Error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
