"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"
import { getUserData } from "./get-user-data"

interface CreateBookingParams {
  serviceId: string
  barberId: number
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await auth.api.getSession({
    headers: headers(),
  })
  const user = session ? await getUserData(session.session) : undefined
  if (user === undefined) {
    throw new Error("Unauthorized")
  }

  await db.booking.create({
    data: {
      ...params,
      userId: user.id,
    },
  })
}
