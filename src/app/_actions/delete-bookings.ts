"use server"

import { db } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
interface DeleteBookingParams {
  id: string
}

export const deleteBooking = async (params: DeleteBookingParams) => {
  const user = await getServerSession(authOptions)
  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.booking.delete({
    where: {
      id: params.id,
    },
  })

  revalidatePath("/bookings")
  revalidatePath("/app")
  revalidatePath("/dashboard")
}
