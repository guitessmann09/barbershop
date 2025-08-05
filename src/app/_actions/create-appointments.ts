"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"
import { getUserData } from "./get-user-data"
import { Service } from "@prisma/client"

interface CreateAppointmentParams {
  userId: string
  services: Service[]
  barberId: number
  date: Date
}

export const createAppointment = async (params: CreateAppointmentParams) => {
  const session = await auth.api.getSession({
    headers: headers(),
  })
  const user = session ? await getUserData(session.session) : undefined
  if (user === undefined) {
    throw new Error("Unauthorized")
  }

  await db.appointment.create({
    data: {
      userId: params.userId,
      barberId: params.barberId,
      date: params.date,
      services: {
        connect: params.services.map((service) => ({ id: service.id })),
      },
    },
  })
}
