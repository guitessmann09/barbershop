"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"
import Stripe from "stripe"

export interface UserSubscriptionInfo {
  id: number
  name: string
  price: number
  benefits: Array<{
    id: number
    description: string
  }>
  stripePrice: string | null
  stripeSubscription?: any
  stripeCustomer?: any
  createdAt?: Date | undefined
  nextBillingDate?: Date | undefined
  currentPeriodStart?: Date | undefined
  subscriptionStatus?: String | undefined
  subscriptionEndDate?: Date | undefined
}

export const getUserSubscription =
  async (): Promise<UserSubscriptionInfo | null> => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      })
      if (!session?.user?.id) {
        throw new Error("Não autorizado")
      }

      // Busca o usuário com suas informações de assinatura
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
          subscription: {
            include: {
              benefits: true,
            },
          },
        },
      })

      if (!user || !user.subscription) {
        return null
      }

      // Se não há chave do Stripe configurada, retorna apenas os dados do banco
      if (!process.env.STRIPE_SECRET_KEY) {
        return {
          id: user.subscription.id,
          name: user.subscription.name,
          price: Number(user.subscription.price),
          benefits: user.subscription.benefits,
          stripePrice: user.subscription.stripePrice,
        }
      }

      // Inicializa o Stripe
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-06-30.basil",
      })

      // Busca informações da assinatura no Stripe
      let stripeSubscription = null
      let stripeCustomer = null
      let createdAt: Date | undefined = undefined
      let nextBillingDate: Date | undefined = undefined
      let currentPeriodStart: Date | undefined = undefined
      let subscriptionStatus: String | undefined = undefined
      let subscriptionEndDate: Date | undefined = undefined

      try {
        if (user.stripeUserId) {
          // Busca o customer no Stripe pelo ID armazenado
          stripeCustomer = await stripe.customers.retrieve(user.stripeUserId)

          // Busca as assinaturas ativas do customer
          const subscriptions = await stripe.subscriptions.list({
            customer: user.stripeUserId,
            status: "active",
            limit: 1,
          })

          if (subscriptions.data.length > 0) {
            stripeSubscription = subscriptions.data[0]
            if (stripeSubscription.created) {
              createdAt = new Date(stripeSubscription.created * 1000)
            }

            if (stripeSubscription.items.data[0].current_period_end) {
              nextBillingDate = new Date(
                stripeSubscription.items.data[0].current_period_end * 1000,
              )
            }

            if (stripeSubscription.items.data[0].current_period_start) {
              currentPeriodStart = new Date(
                stripeSubscription.items.data[0].current_period_start * 1000,
              )
            }
            if (stripeSubscription.status) {
              subscriptionStatus = stripeSubscription.status
            }
            if (
              stripeSubscription.cancel_at_period_end &&
              stripeSubscription.cancel_at
            ) {
              subscriptionEndDate = new Date(
                stripeSubscription.cancel_at * 1000,
              )
            }
          }
        }
      } catch (stripeError) {
        console.error("Erro ao buscar informações no Stripe:", stripeError)
        // Continua sem as informações do Stripe
      }

      return {
        id: user.subscription.id,
        name: user.subscription.name,
        price: Number(user.subscription.price),
        benefits: user.subscription.benefits,
        stripePrice: user.subscription.stripePrice,
        stripeSubscription,
        stripeCustomer,
        createdAt,
        nextBillingDate,
        currentPeriodStart,
        subscriptionStatus,
        subscriptionEndDate,
      }
    } catch (error) {
      console.error("Erro ao buscar assinatura do usuário:", error)
      throw error
    }
  }
