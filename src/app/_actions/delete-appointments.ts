"use server"

import { db } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { getUserData } from "./get-user-data"
interface DeleteAppointmentParams {
  id: string
}

export const deleteAppointment = async (params: DeleteAppointmentParams) => {
  const session = await auth.api.getSession({
    headers: headers(),
  })
  const user = session ? await getUserData(session.session) : null
  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.appointment.delete({
    where: {
      id: params.id,
    },
  })

  revalidatePath("/appointments")
  revalidatePath("/app")
  revalidatePath("/dashboard")
}
