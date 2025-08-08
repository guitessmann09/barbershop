"use server"

import { db } from "@/lib/prisma"
import { addMinutes } from "date-fns"

interface Params {
  barberId: number
  date: string // ISO string
  duration: number // minutos
  appointmentIdToIgnore?: number // para ignorar conflito consigo mesmo
}

export async function isBarberAvailable({
  barberId,
  date,
  duration,
  appointmentIdToIgnore,
}: Params): Promise<boolean> {
  const start = new Date(date)
  const end = addMinutes(start, duration)

  // Buscar compromissos do barbeiro no dia
  const appointments = await db.appointment.findMany({
    where: {
      barberId,
      id: appointmentIdToIgnore
        ? { not: String(appointmentIdToIgnore) }
        : undefined,
      date: {
        gte: new Date(start.setHours(0, 0, 0, 0)),
        lt: new Date(start.setHours(23, 59, 59, 999)),
      },
    },
  })

  // Verificar conflito com outros agendamentos
  const hasConflict = appointments.some((appt) => {
    const apptStart = new Date(appt.date)
    const apptEnd = addMinutes(apptStart, duration)
    return (
      (start >= apptStart && start < apptEnd) ||
      (end > apptStart && end <= apptEnd) ||
      (start <= apptStart && end >= apptEnd)
    )
  })

  if (hasConflict) return false

  // Verificar bloqueios
  const blockedSlots = await db.blockedSlot.findMany({
    where: {
      barberId,
      date: {
        gte: new Date(start.setHours(0, 0, 0, 0)),
        lt: new Date(start.setHours(23, 59, 59, 999)),
      },
    },
  })

  const isBlocked = blockedSlots.some((slot) => {
    const blockedStart = new Date(slot.date)
    const blockedEnd = addMinutes(blockedStart, 60)
    return (
      (start >= blockedStart && start < blockedEnd) ||
      (end > blockedStart && end <= blockedEnd) ||
      (start <= blockedStart && end >= blockedEnd)
    )
  })

  if (isBlocked) return false

  // Verificar disponibilidade do barbeiro (horário de trabalho)
  const weekDay = start.getDay()
  const availability = await db.availability.findFirst({
    where: {
      barberId,
      weekday: weekDay,
    },
  })
  if (!availability) return false

  const [startHour, startMinute] = availability.startTime.split(":").map(Number)
  const [endHour, endMinute] = availability.endTime.split(":").map(Number)
  const workStart = new Date(start)
  workStart.setHours(startHour, startMinute, 0, 0)
  const workEnd = new Date(start)
  workEnd.setHours(endHour, endMinute, 0, 0)

  if (start < workStart || end > workEnd) return false

  return true
}
