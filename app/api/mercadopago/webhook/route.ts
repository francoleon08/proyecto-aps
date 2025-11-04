import { NextRequest } from 'next/server'
import { processPayment } from '@/lib/payments'

export async function POST(request: NextRequest): Promise<Response> {
  const body: any = await request.json()
  if (body.data && body.data.id) await processPayment(body.data.id)
  return new Response(null, { status: 200 })
}
