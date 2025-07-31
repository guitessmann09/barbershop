"use server"

import { db } from "@/lib/prisma"
import { Barber, Cargo } from "@prisma/client"
import { Session } from "better-auth"

export interface UserData {
  id: string
  name: string | null
  email: string
  phone: string | null
  createdAt: Date
  updatedAt: Date
  emailVerified: boolean
  image: string | null
  subscriptionId: number | null
  stripeUserId: string | null
  subscription?: {
    id: number
    name: string
    price: number
  }
  employee?: {
    id: string
    cargo: Cargo
  }
}

export const getUserData = async (
  session: Session,
): Promise<UserData | undefined> => {
  if (!session.userId) {
    throw new Error("Unauthorized")
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      Subscription: true,
      employee: true,
    },
  })

  if (!user) {
    throw new Error("Unauthorized")
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    emailVerified: user.emailVerified,
    image: user.image,
    subscriptionId: user.subscriptionId,
    stripeUserId: user.stripeUserId,
    subscription: user.Subscription
      ? {
          id: user.Subscription.id,
          name: user.Subscription.name,
          price: Number(user.Subscription.price),
        }
      : undefined,
    employee: user.employee
      ? {
          id: user.employee.id,
          cargo: user.employee.cargo,
        }
      : undefined,
  }
}
