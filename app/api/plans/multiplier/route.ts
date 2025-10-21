import { NextResponse } from 'next/server'
import { getPlanMultiplier } from '@/actions/plans'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  if (!type) {
    return NextResponse.json(
      { error: 'Missing "type" query parameter' },
      { status: 400 }
    )
  }

  try {
    const multiplier = await getPlanMultiplier(type)
    if (multiplier === null) {
      return NextResponse.json(
        { error: `No plan found for type: ${type}` },
        { status: 404 }
      )
    }

    return NextResponse.json({ multiplier })
    
  } catch (error) {
    console.error('[GET /api/plans/multiplier] Error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
