"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"
import { PaymentMethod } from "@prisma/client"

export interface CloseOrderItemInput {
  productId: string
  quantity: number
  price: number
}

export interface CloseOrderInput {
  orderId: number
  items: CloseOrderItemInput[]
  paymentMethod: PaymentMethod
  discountValue?: number
}

export async function closeOrderAction(input: CloseOrderInput) {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session) {
    throw new Error("Unauthorized")
  }
  if (!input.paymentMethod) {
    throw new Error("Método de pagamento é obrigatório para fechar a comanda")
  }

  const normalizedItems = (input.items || []).filter((i) => i.quantity > 0)

  return await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      include: { items: true, appointment: true },
    })

    if (!order) {
      throw new Error("Comanda não encontrada")
    }

    await tx.orderItem.deleteMany({ where: { orderId: input.orderId } })
    if (normalizedItems.length > 0) {
      await tx.orderItem.createMany({
        data: normalizedItems.map((i) => ({
          orderId: input.orderId,
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      })
    }

    const refreshed = await tx.order.findUnique({
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

    const updated = await tx.order.update({
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

    const itemsByProduct = new Map<string, number>()
    for (const it of refreshed.items) {
      itemsByProduct.set(
        it.productId,
        (itemsByProduct.get(it.productId) || 0) + it.quantity,
      )
    }

    if (itemsByProduct.size > 0) {
      const products = await tx.product.findMany({
        where: { id: { in: Array.from(itemsByProduct.keys()) } },
        select: { id: true, quantityInStock: true },
      })

      const updates = products.map((p) => {
        const qtyToDecrement = itemsByProduct.get(p.id) || 0
        const newQuantity = Math.max(0, p.quantityInStock - qtyToDecrement)
        return tx.product.update({
          where: { id: p.id },
          data: { quantityInStock: newQuantity },
        })
      })

      await Promise.all(updates)
    }

    return updated
  })
}
