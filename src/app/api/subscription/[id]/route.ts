import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import Stripe from "stripe"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verifica se o usuário está autenticado
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const subscriptionId = parseInt(params.id)
    if (isNaN(subscriptionId)) {
      return NextResponse.json(
        { error: "ID da assinatura inválido" },
        { status: 400 },
      )
    }

    // Busca a assinatura no banco de dados
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        benefits: true,
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "Assinatura não encontrada" },
        { status: 404 },
      )
    }

    // Se não há chave do Stripe configurada, retorna apenas os dados do banco
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        subscription: {
          id: subscription.id,
          name: subscription.name,
          price: subscription.price,
          benefits: subscription.benefits,
          stripePrice: subscription.stripePrice,
          // Informações do Stripe não disponíveis
          stripePriceDetails: null,
        },
      })
    }

    // Inicializa o Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-30.basil",
    })

    // Busca informações detalhadas do preço no Stripe
    let stripePriceDetails = null

    if (subscription.stripePrice) {
      try {
        stripePriceDetails = await stripe.prices.retrieve(
          subscription.stripePrice,
        )
      } catch (stripeError) {
        console.error("Erro ao buscar preço no Stripe:", stripeError)
        // Continua sem as informações do Stripe
      }
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        name: subscription.name,
        price: subscription.price,
        benefits: subscription.benefits,
        stripePrice: subscription.stripePrice,
        stripePriceDetails: stripePriceDetails,
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
