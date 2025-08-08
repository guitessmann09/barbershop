"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"
import { getUserData } from "./get-user-data"
import { Service } from "@prisma/client"

interface UpdateAppointmentParams {
  appointmentId: string
  services: Service[]
  barberId: number
}

export const updateAppointment = async (params: UpdateAppointmentParams) => {
  const session = await auth.api.getSession({
    headers: headers(),
  })
  const user = session ? await getUserData(session.session) : undefined
  if (user === undefined) {
    throw new Error("Unauthorized")
  }

  // Verificar se o agendamento existe
  const existingAppointment = await db.appointment.findUnique({
    where: { id: params.appointmentId },
    include: {
      services: {
        include: {
          service: true,
        },
      },
      order: true,
    },
  })

  if (!existingAppointment) {
    throw new Error("Agendamento não encontrado")
  }

  // Calcular novo total baseado nos serviços
  const newTotal = params.services.reduce((sum, service) => {
    return sum + Number(service.price)
  }, 0)

  // Atualizar o agendamento
  const updatedAppointment = await db.appointment.update({
    where: { id: params.appointmentId },
    data: {
      barberId: params.barberId,
      total: newTotal,
    },
  })

  // Atualizar o pedido associado
  await db.order.update({
    where: { id: existingAppointment.orderId },
    data: {
      total: newTotal,
    },
  })

  // Remover serviços existentes
  await db.appointmentService.deleteMany({
    where: { appointmentId: params.appointmentId },
  })

  // Adicionar novos serviços
  const appointmentServices = params.services.map((service) => ({
    appointmentId: params.appointmentId,
    serviceId: service.id,
  }))

  await db.appointmentService.createMany({
    data: appointmentServices,
  })

  return updatedAppointment
}
