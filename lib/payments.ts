'use server'

import { Preference, Payment, MercadoPagoConfig } from 'mercadopago'
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes'
import { registerPayment } from '@/actions/payments'
import { Subscription } from '@/types/custom'
import { TablesInsert } from '@/types/database'

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' })
const preference = new Preference(client)

export async function processPreference(
  coupon: TablesInsert<'payment_coupon'>,
  subscriptions: Subscription[]
): Promise<string> {
  const params: string = `coupon_id=${coupon.code}&amount=${coupon.amount}&date=${new Date().toISOString()}`
  return new Promise<string>((resolve: (value: string) => void, reject: (error: Error) => void): void => {
    preference
      .create({
        body: {
          items: [
            ...subscriptions.map((subscription: Subscription) => ({
              id: subscription.id,
              title: subscription.name,
              quantity: 1,
              unit_price: subscription.amount,
            })),
          ],
          auto_return: 'all',
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL}/payments/success?${params}`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/payments/failure?${params}`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/payments/pending?${params}`,
          },
          notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
          metadata: {
            subscriptions,
          },
        },
      })
      .then((response): void => {
        if (response.init_point) resolve(response.init_point)
        else reject(new Error('Failed to create Mercado Pago preference: init_point is undefined'))
      })
      .catch((error: Error): void => {
        reject(error)
      })
  })
}

export async function processPayment(id: string): Promise<void> {
  const payment: PaymentResponse = await new Payment(client).get({ id })
  const subscriptions: Subscription[] = payment.metadata?.subscriptions as Subscription[]
  console.log(subscriptions)

  if (payment.status === 'approved') {
    if (subscriptions) {
      await Promise.all(
        subscriptions.map(async (subscription: Subscription) => {
          await registerPayment({
            amount_paid: subscription.amount,
            coupon_id: subscription.coupon,
            method: 'external_platform',
            payment_day: new Date().toISOString(),
            policy_id: subscription.id,
          })
        })
      )
    }
  }
}
