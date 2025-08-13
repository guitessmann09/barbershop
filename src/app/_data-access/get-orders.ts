"server only"

import { db } from "@/lib/prisma"
import { Order } from "@prisma/client"

export interface OrderDto extends Order {
  status: "pending" | "paid"
}

export const getOrders = async (): Promise<OrderDto[]> => {
  const orders = await db.order.findMany({})
  return orders.map((order) => ({
    ...order,
    status: order.paymentMethod === null ? "pending" : "paid",
  }))
}

export type OrderWithUser = OrderDto & {
  user?: { id: string; name: string | null; email: string }
}

export const getOrdersWithUser = async (): Promise<OrderWithUser[]> => {
  const orders = await db.order.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      appointment: { include: { services: { include: { service: true } } } },
    },
  })

  return orders.map((order) => ({
    ...order,
    status: order.paymentMethod === null ? "pending" : "paid",
  }))
}
