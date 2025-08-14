"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"
import { PaymentMethod } from "@prisma/client"

export interface UpdateOrderItemInput {
  id?: string
  productId: string
  quantity: number
  price: number
}

export interface UpdateOrderInput {
  orderId: number
  items: UpdateOrderItemInput[]
  paymentMethod: PaymentMethod | null
  discountValue?: number // valor absoluto de desconto em BRL
}

export async function updateOrderAction(input: UpdateOrderInput) {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session) {
    throw new Error("Unauthorized")
  }

  // Normaliza itens: remove itens com quantidade <= 0
  const normalizedItems = input.items.filter((i) => i.quantity > 0)

  const order = await db.order.findUnique({
    where: { id: input.orderId },
    include: { items: true, appointment: true },
  })

  if (!order) {
    throw new Error("Comanda não encontrada")
  }

  // Atualiza/insere itens
  // Estratégia simples: apaga todos e recria (mantém lógica previsível)
  await db.orderItem.deleteMany({ where: { orderId: input.orderId } })
  if (normalizedItems.length > 0) {
    await db.orderItem.createMany({
      data: normalizedItems.map((i) => ({
        orderId: input.orderId,
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
      })),
    })
  }

  // Recalcula total: serviços do agendamento + itens de produto
  const refreshed = await db.order.findUnique({
    where: { id: input.orderId },
    include: {
      appointment: { include: { services: { include: { service: true } } } },
      items: true,
    },
  })

  if (!refreshed) {
    throw new Error("Erro ao recalcular comanda")
  }

  const servicesTotal = (refreshed.appointment?.services || []).reduce(
    (sum, s) => sum + Number(s.service.price),
    0,
  )
  const productsTotal = (refreshed.items || []).reduce(
    (sum, it) => sum + Number(it.price) * it.quantity,
    0,
  )

  const subtotal = servicesTotal + productsTotal
  const discount = Math.max(0, Number(input.discountValue || 0))
  const total = Math.max(0, subtotal - discount)

  const updated = await db.order.update({
    where: { id: input.orderId },
    data: {
      total,
      paymentMethod: input.paymentMethod,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      appointment: { include: { services: { include: { service: true } } } },
      items: { include: { product: true } },
    },
  })

  return updated
}
