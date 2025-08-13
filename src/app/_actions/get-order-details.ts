"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"

export async function getOrderDetailsAction(orderId: number) {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session) {
    throw new Error("Unauthorized")
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      appointment: {
        include: {
          services: { include: { service: true } },
        },
      },
      items: { include: { product: true } },
    },
  })

  if (!order) {
    throw new Error("Comanda não encontrada")
  }

  return order
}
