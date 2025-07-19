"use server"

import { db } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { getUserData } from "./get-user-data"
interface DeleteBookingParams {
  id: string
}

export const deleteBooking = async (params: DeleteBookingParams) => {
  const session = await auth.api.getSession({
    headers: headers(),
  })
  const user = session ? await getUserData(session.session) : null
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
