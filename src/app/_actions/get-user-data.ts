"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"

export interface UserData {
  id: string
  name: string | null
  email: string
  phone: string | null
  createdAt: Date
  updatedAt: Date
  emailVerified: Date | null
  image: string | null
  subscriptionID: number | null
  stripeUserId: string | null
  subscription?: {
    id: number
    name: string
    price: number
  } | null
}

export const getUserData = async (): Promise<UserData | null> => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return null
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
      },
    })

    if (!user) {
      return null
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
        : null,
    }
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error)
    return null
  }
}
