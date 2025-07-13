"use server"

import { db } from "@/lib/prisma"
import Stripe from "stripe"

interface CreateStripeCheckoutBySubscriptionProps {
  userId: string | undefined
  subscriptionId: number
}

export const createStripeCheckoutBySubscription = async ({
  userId,
  subscriptionId,
}: CreateStripeCheckoutBySubscriptionProps) => {
  if (!userId) {
    throw new Error("Não autorizado")
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Chave secreta do Stripe não definida")
  }

  // Busca a assinatura no banco de dados
  const subscription = await db.subscription.findUnique({
    where: { id: subscriptionId },
  })

  if (!subscription) {
    throw new Error("Assinatura não encontrada")
  }

  if (!subscription.stripePrice) {
    throw new Error("Assinatura não possui um preço do Stripe configurado")
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000/subscriptions",
    metadata: {
      userId: userId,
      subscriptionId: subscriptionId,
    },
    line_items: [
      {
        price: subscription.stripePrice!,
        quantity: 1,
      },
    ],
  })

  return { sessionId: session.id }
}
