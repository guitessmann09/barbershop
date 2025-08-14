"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"
import { PaymentMethod } from "@prisma/client"

export interface CreateAndCloseOrderItemInput {
  productId: string
  quantity: number
}

export interface CreateAndCloseOrderInput {
  userId: string
  items: CreateAndCloseOrderItemInput[]
  paymentMethod: PaymentMethod
}

export async function createAndCloseOrderAction(
  input: CreateAndCloseOrderInput,
) {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session) {
    throw new Error("Unauthorized")
  }

  if (!input.paymentMethod) {
    throw new Error("Método de pagamento é obrigatório para fechar a comanda")
  }

  const normalizedItems = (input.items || []).filter((i) => i.quantity > 0)
  if (normalizedItems.length === 0) {
    throw new Error("A comanda precisa ter pelo menos 1 item")
  }

  const products = await db.product.findMany({
    where: { id: { in: normalizedItems.map((i) => i.productId) } },
    select: { id: true, price: true, quantityInStock: true },
  })

  const priceByProductId = new Map(products.map((p) => [p.id, Number(p.price)]))

  const itemsWithPrice = normalizedItems.map((i) => {
    const price = priceByProductId.get(i.productId)
    if (price === undefined) {
      throw new Error("Produto inválido na comanda")
    }
    return { ...i, price }
  })

  const total = itemsWithPrice.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return await db.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: input.userId,
        total,
        paymentMethod: input.paymentMethod,
      },
    })

    await tx.orderItem.createMany({
      data: itemsWithPrice.map((i) => ({
        orderId: order.id,
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
      })),
    })

    // Atualiza o estoque com base nos itens da comanda
    const itemsByProduct = new Map<string, number>()
    for (const it of itemsWithPrice) {
      itemsByProduct.set(
        it.productId,
        (itemsByProduct.get(it.productId) || 0) + it.quantity,
      )
    }

    if (itemsByProduct.size > 0) {
      const productsToUpdate = await tx.product.findMany({
        where: { id: { in: Array.from(itemsByProduct.keys()) } },
        select: { id: true, quantityInStock: true },
      })

      const updates = productsToUpdate.map((p) => {
        const qtyToDecrement = itemsByProduct.get(p.id) || 0
        const newQuantity = Math.max(0, p.quantityInStock - qtyToDecrement)
        return tx.product.update({
          where: { id: p.id },
          data: { quantityInStock: newQuantity },
        })
      })

      await Promise.all(updates)
    }

    const created = await tx.order.findUnique({
      where: { id: order.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    })

    return created
  })
}
