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

  const total = params.services.reduce((sum, service) => {
    return sum + Number(service.price)
  }, 0)

  const order = await db.order.create({
    data: {
      userId: params.userId,
      total: total,
    },
  })

  const appointment = await db.appointment.create({
    data: {
      userId: params.userId,
      barberId: params.barberId,
      date: params.date,
      orderId: order.id,
      total: total,
    },
  })

  await db.order.update({
    where: { id: order.id },
    data: { appointmentId: appointment.id },
  })

  const appointmentServices = params.services.map((service) => ({
    appointmentId: appointment.id,
    serviceId: service.id,
  }))

  await db.appointmentService.createMany({
    data: appointmentServices,
  })

  return appointment
}
