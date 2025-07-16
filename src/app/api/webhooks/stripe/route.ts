import { db } from "@/lib/prisma"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Chave secreta do Stripe não definida")
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  })

  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.error()
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY
  if (!webhookSecret) {
    throw new Error("Chave secreta do webhook Stripe não definida")
  }
  const text = await req.text()
  const event = stripe.webhooks.constructEvent(text, signature, webhookSecret)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = event.data.object.metadata?.userId
    const subscriptionId = event.data.object.metadata?.subscriptionId
    if (!userId || !subscriptionId) {
      return NextResponse.json({
        received: true,
      })
    }

    const customerId = session.customer as string

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        subscriptionID: Number(subscriptionId),
        stripeUserId: customerId,
      },
    })
  }
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    // Busca o usuário pelo stripeUserId (customer ID)
    const user = await db.user.findFirst({
      where: {
        stripeUserId: customerId,
      },
    })

    if (user) {
      // Define o subscriptionID como null quando a assinatura for deletada
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          subscriptionID: null,
        },
      })
    }
  }
  if (event.type === "customer.deleted") {
    const customer = event.data.object as Stripe.Customer
    const customerId = customer.id

    // Busca o usuário pelo stripeUserId (customer ID)
    const user = await db.user.findFirst({
      where: {
        stripeUserId: customerId,
      },
    })

    if (user) {
      // Remove o stripeUserId e subscriptionID quando o customer for deletado
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeUserId: null,
          subscriptionID: null,
        },
      })
    }
  }
  return NextResponse.json({
    received: true,
  })
}
