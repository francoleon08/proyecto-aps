import { NextRequest, NextResponse } from 'next/server'
import { createContractedPolicy } from '@/actions/policies'
import { QuoteData } from '@/lib/policy-plan'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { insuranceType, clientType, multiplier, policyData, selectedPlan, basePrices } = body
    const quoteData: QuoteData = body

    const res = await createContractedPolicy(quoteData)

    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: 'Registro de póliza exitoso',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[POST /api/policy/register]', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
