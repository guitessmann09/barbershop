import { auth } from "@/lib/auth"
import { Appointment } from "@prisma/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { headers } from "next/headers"

const getUserAppointments = async (appointments: Appointment[]) => {
  const session = await auth.api.getSession({
    headers: headers(),
  })
  return appointments.filter(
    (appointment) => appointment.userId === (session as any)?.user.id,
  )
}

export const getConfirmedAppointments = async (appointments: Appointment[]) => {
  const userAppointments = await getUserAppointments(appointments)
  return userAppointments
    .filter((appointment) => appointment.date > new Date())
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}

export const getCompletedAppointments = async (appointments: Appointment[]) => {
  const userAppointments = await getUserAppointments(appointments)
  return userAppointments
    .filter((appointment) => appointment.date < new Date())
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}

const today = new Date()
const todayString = format(today, "dd/MM/yyyy", { locale: ptBR })

export const getTodayAppointments = (myAppointments: Appointment[]) =>
  myAppointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      return (
        format(appointmentDate, "dd/MM/yyyy", { locale: ptBR }) === todayString
      )
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

export const getInComingAppointments = (todayAppointments: Appointment[]) =>
  todayAppointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      return appointmentDate.getTime() > today.getTime()
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

export const getFutureAppointments = (myAppointments: Appointment[]) =>
  myAppointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      return (
        format(appointmentDate, "dd/MM/yyyy", { locale: ptBR }) > todayString
      )
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
