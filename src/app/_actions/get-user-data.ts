"use server"

import { db } from "@/lib/prisma"
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
  subscriptionID: number | null
  stripeUserId: string | null
  subscription?: {
    id: number
    name: string
    price: number
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
      subscription: true,
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
    subscriptionID: user.subscriptionID,
    stripeUserId: user.stripeUserId,
    subscription: user.subscription
      ? {
          id: user.subscription.id,
          name: user.subscription.name,
          price: Number(user.subscription.price),
        }
      : undefined,
  }
}
