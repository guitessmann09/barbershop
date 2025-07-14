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
    const userId = event.data.object.metadata?.userId
    const subscriptionId = event.data.object.metadata?.subscriptionId
    if (!userId) {
      return NextResponse.json({
        received: true,
      })
    }
    if (!subscriptionId) {
      return NextResponse.json({
        received: true,
      })
    }
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        subscriptionID: Number(subscriptionId),
      },
    })
  }
  return NextResponse.json({
    received: true,
  })
}
