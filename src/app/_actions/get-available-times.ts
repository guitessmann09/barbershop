"use server"

import { db } from "@/lib/prisma"
import { format, set, isAfter, isSameDay, addMinutes } from "date-fns"

export interface AvailableTime {
  time: string
  availableBarbers: number[]
}

export async function getAvailableTimes(
  selectedDay: Date,
  serviceDurationMinutes: number = 30,
): Promise<AvailableTime[]> {
  try {
    const weekDay = selectedDay.getDay()
    const now = new Date()

    // Buscar todas as disponibilidades dos barbeiros para o dia da semana
    const availabilities = await db.availability.findMany({
      where: {
        weekday: weekDay,
      },
      include: {
        barber: {
          include: {
            appointments: {
              where: {
                date: {
                  gte: set(selectedDay, {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    milliseconds: 0,
                  }),
                  lt: set(selectedDay, {
                    hours: 23,
                    minutes: 59,
                    seconds: 59,
                    milliseconds: 999,
                  }),
                },
              },
            },
            blockedSlots: {
              where: {
                date: {
                  gte: set(selectedDay, {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    milliseconds: 0,
                  }),
                  lt: set(selectedDay, {
                    hours: 23,
                    minutes: 59,
                    seconds: 59,
                    milliseconds: 999,
                  }),
                },
              },
            },
          },
        },
      },
    })

    if (availabilities.length === 0) {
      return []
    }

    // Gerar todos os horários possíveis baseados nas disponibilidades
    const allTimes = new Set<string>()

    availabilities.forEach((availability) => {
      const startTime = availability.startTime
      const endTime = availability.endTime
      const slotDuration = availability.slotDuration

      // Converter horários para minutos para facilitar cálculos
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)

      const startMinutes = startHour * 60 + startMinute
      const endMinutes = endHour * 60 + endMinute

      // Gerar slots de tempo
      for (let time = startMinutes; time < endMinutes; time += slotDuration) {
        const hour = Math.floor(time / 60)
        const minute = time % 60
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        allTimes.add(timeString)
      }
    })

    // Converter para array e ordenar
    const sortedTimes = Array.from(allTimes).sort()

    // Filtrar horários passados se for hoje
    const filteredTimes = isSameDay(selectedDay, now)
      ? sortedTimes.filter((time) => {
          const [hour, minute] = time.split(":").map(Number)
          const timeToCheck = set(now, {
            hours: hour,
            minutes: minute,
            seconds: 0,
            milliseconds: 0,
          })
          return isAfter(timeToCheck, now)
        })
      : sortedTimes

    // Para cada horário, verificar quais barbeiros estão disponíveis
    const availableTimes: AvailableTime[] = []

    filteredTimes.forEach((time) => {
      const [hour, minute] = time.split(":").map(Number)
      const timeSlot = set(selectedDay, {
        hours: hour,
        minutes: minute,
        seconds: 0,
        milliseconds: 0,
      })

      const availableBarbers: number[] = []

      availabilities.forEach((availability) => {
        const barber = availability.barber

        // Verificar se o barbeiro trabalha neste horário
        const [startHour, startMinute] = availability.startTime
          .split(":")
          .map(Number)
        const [endHour, endMinute] = availability.endTime.split(":").map(Number)

        const startTime = set(selectedDay, {
          hours: startHour,
          minutes: startMinute,
          seconds: 0,
          milliseconds: 0,
        })

        const endTime = set(selectedDay, {
          hours: endHour,
          minutes: endMinute,
          seconds: 0,
          milliseconds: 0,
        })

        // Verificar se o horário está dentro do período de trabalho
        if (timeSlot < startTime || timeSlot >= endTime) {
          return
        }

        // Verificar se há tempo suficiente para o serviço
        const serviceEndTime = addMinutes(timeSlot, serviceDurationMinutes)
        if (serviceEndTime > endTime) {
          return
        }

        // Verificar se o barbeiro não tem compromissos neste horário
        const hasConflict = barber.appointments.some((appointment) => {
          const appointmentStart = new Date(appointment.date)
          const appointmentEnd = addMinutes(
            appointmentStart,
            serviceDurationMinutes,
          )

          // Verificar sobreposição de horários
          return (
            (timeSlot >= appointmentStart && timeSlot < appointmentEnd) ||
            (serviceEndTime > appointmentStart &&
              serviceEndTime <= appointmentEnd) ||
            (timeSlot <= appointmentStart && serviceEndTime >= appointmentEnd)
          )
        })

        // Verificar se o horário não está bloqueado
        const isBlocked = barber.blockedSlots.some((blockedSlot) => {
          const blockedStart = new Date(blockedSlot.date)
          const blockedEnd = addMinutes(blockedStart, 60) // Assumindo que bloqueios são de 1 hora

          return (
            (timeSlot >= blockedStart && timeSlot < blockedEnd) ||
            (serviceEndTime > blockedStart && serviceEndTime <= blockedEnd) ||
            (timeSlot <= blockedStart && serviceEndTime >= blockedEnd)
          )
        })

        if (!hasConflict && !isBlocked) {
          availableBarbers.push(barber.id)
        }
      })

      if (availableBarbers.length > 0) {
        availableTimes.push({
          time,
          availableBarbers,
        })
      }
    })

    return availableTimes
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error)
    return []
  }
}
