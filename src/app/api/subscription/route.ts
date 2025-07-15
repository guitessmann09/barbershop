import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import Stripe from "stripe"

export async function GET(req: NextRequest) {
  try {
    // Verifica se o usuário está autenticado
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
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

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      )
    }

    // Se o usuário não tem assinatura, retorna null
    if (!user.subscription) {
      return NextResponse.json({
        subscription: null,
        message: "Usuário não possui assinatura ativa",
      })
    }

    // Se não há chave do Stripe configurada, retorna apenas os dados do banco
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        subscription: {
          id: user.subscription.id,
          name: user.subscription.name,
          price: user.subscription.price,
          benefits: user.subscription.benefits,
          stripePrice: user.subscription.stripePrice,
          // Informações do Stripe não disponíveis
          stripeSubscription: null,
        },
      })
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
    let currentPeriodEnd: Date | undefined = undefined

    try {
      // Busca o customer no Stripe pelo email do usuário
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      })

      if (customers.data.length > 0) {
        stripeCustomer = customers.data[0]

        // Busca as assinaturas ativas do customer
        const subscriptions = await stripe.subscriptions.list({
          customer: stripeCustomer.id,
          status: "active",
          limit: 1,
        })

        if (subscriptions.data.length > 0) {
          stripeSubscription = subscriptions.data[0]
          const subscription = stripeSubscription as any

          if (subscription.created) {
            createdAt = new Date(subscription.created * 1000)
          }

          if (subscription.current_period_end) {
            nextBillingDate = new Date(subscription.current_period_end * 1000)
          }

          if (subscription.current_period_start) {
            currentPeriodStart = new Date(
              subscription.current_period_start * 1000,
            )
          }

          if (subscription.current_period_end) {
            currentPeriodEnd = new Date(subscription.current_period_end * 1000)
          }
        }
      }
    } catch (stripeError) {
      console.error("Erro ao buscar informações no Stripe:", stripeError)
      // Continua sem as informações do Stripe
    }

    return NextResponse.json({
      subscription: {
        id: user.subscription.id,
        name: user.subscription.name,
        price: user.subscription.price,
        benefits: user.subscription.benefits,
        stripePrice: user.subscription.stripePrice,
        stripeSubscription: stripeSubscription,
        stripeCustomer: stripeCustomer,
        createdAt: createdAt,
        nextBillingDate: nextBillingDate,
        currentPeriodStart: currentPeriodStart,
        currentPeriodEnd: currentPeriodEnd,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    )
  }
}
