"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"

export async function deleteOrderAction(orderId: number) {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session) {
    throw new Error("Unauthorized")
  }

  await db.orderItem.deleteMany({ where: { orderId } })
  await db.order.delete({ where: { id: orderId } })
}
