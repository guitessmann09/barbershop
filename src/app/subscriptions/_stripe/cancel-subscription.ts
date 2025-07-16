"use server"

import { revalidatePath } from "next/cache"
import Stripe from "stripe"

interface CreateStripeCancelSubscriptionProps {
  userId: string
  stripeSubscriptionId: string
}
export async function cancelSubscription({
  userId,
  stripeSubscriptionId,
}: CreateStripeCancelSubscriptionProps) {
  if (!userId) {
    throw new Error("Não autorizado")
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Chave secreta do Stripe não definida")
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const canceledSubscription = await stripe.subscriptions.update(
    stripeSubscriptionId,
    {
      cancel_at_period_end: true,
      metadata: {
        userId: userId,
      },
    },
  )

  revalidatePath("/subscriptions")
  return { canceledSubscriptionId: canceledSubscription.id }
}
