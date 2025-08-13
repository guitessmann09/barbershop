"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"
import { PaymentMethod } from "@prisma/client"

export interface CreateOrderItemInput {
  productId: string
  quantity: number
}

export interface CreateOrderInput {
  userId: string
  items: CreateOrderItemInput[]
  paymentMethod: PaymentMethod | null
}

export async function createOrderAction(input: CreateOrderInput) {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session) {
    throw new Error("Unauthorized")
  }

  const normalizedItems = (input.items || []).filter((i) => i.quantity > 0)
  if (normalizedItems.length === 0) {
    throw new Error("A comanda precisa ter pelo menos 1 item")
  }

  const products = await db.product.findMany({
    where: { id: { in: normalizedItems.map((i) => i.productId) } },
    select: { id: true, price: true },
  })

  // Mapa rápido de preço por produto
  const priceByProductId = new Map(products.map((p) => [p.id, Number(p.price)]))

  const itemsWithPrice = normalizedItems.map((i) => {
    const price = priceByProductId.get(i.productId)
    if (price === undefined) {
      throw new Error("Produto inválido na comanda")
    }
    return { ...i, price }
  })

  const total = itemsWithPrice.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const order = await db.order.create({
    data: {
      userId: input.userId,
      total,
      paymentMethod: input.paymentMethod,
    },
  })

  await db.orderItem.createMany({
    data: itemsWithPrice.map((i) => ({
      orderId: order.id,
      productId: i.productId,
      quantity: i.quantity,
      price: i.price,
    })),
  })

  const created = await db.order.findUnique({
    where: { id: order.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: true } },
    },
  })

  return created
}
