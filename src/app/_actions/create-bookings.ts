"use server"

import { db } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

interface CreateBookingParams {
  serviceId: string
  barberId: number
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const user = await getServerSession(authOptions)
  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.booking.create({
    data: {
      ...params,
      userId: (user as any).user.id,
    },
  })
}
