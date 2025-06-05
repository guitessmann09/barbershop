"use server"

import { db } from "@/lib/prisma"

interface CreateBookingParams {
  serviceId: string
  userId: string
  barberId: number
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const { serviceId, userId, barberId, date } = params

  const booking = await db.booking.create({
    data: params,
  })
}
