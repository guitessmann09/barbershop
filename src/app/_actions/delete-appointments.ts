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

  // Buscar o agendamento e o pedido relacionado
  const appointment = await db.appointment.findUnique({
    where: { id: params.id },
    include: { order: true },
  })
  if (!appointment) {
    throw new Error("Agendamento não encontrado")
  }

  // Deletar o agendamento
  await db.appointment.delete({
    where: { id: params.id },
  })

  // Atualizar o pedido, subtraindo o valor do serviço do agendamento deletado
  const orderId = appointment.orderId
  if (orderId) {
    // Buscar o pedido atualizado (após deleção do agendamento)
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        appointment: true,
        items: true,
      },
    })
    if (order) {
      // Subtrair o valor do serviço do total do pedido
      const novoTotal = Number(order.total) - Number(appointment.total)
      // Atualizar o total do pedido
      await db.order.update({
        where: { id: orderId },
        data: { total: novoTotal > 0 ? novoTotal : 0 },
      })
      // Se não houver mais agendamento nem produtos, deletar o pedido
      const temAgendamento = !!order.appointment
      const temProdutos = order.items.length > 0
      if (!temAgendamento && !temProdutos) {
        await db.order.delete({ where: { id: orderId } })
      }
    }
  }

  revalidatePath("/appointments")
  revalidatePath("/app")
  revalidatePath("/dashboard")
}
