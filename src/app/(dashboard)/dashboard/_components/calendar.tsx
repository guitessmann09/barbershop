import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/prisma"
import { Clock, Plus, User } from "lucide-react"
import Image from "next/image"
import { addMinutes, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Separator } from "@/components/ui/separator"
import { Barber } from "@prisma/client"
import { Dialog } from "@radix-ui/react-dialog"
import { createAppointment } from "@/app/_actions/create-appointments"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CalendarAppointmentForm from "./calendar-appointment-form"
import { Badge } from "@/components/ui/badge"

const Calendar = async () => {
  const barbers = await db.barber.findMany({})
  const appointments = await db.appointment.findMany({
    include: {
      service: {
        select: {
          name: true,
          durationMinutes: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  // Gerar horários de 8:00 às 18:00 de 10 em 10 minutos
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 10; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(timeString)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const getAppointmentByBarber = (barberId: number, time: string) => {
    return appointments.find(
      (appointment) =>
        appointment.barberId === barberId &&
        format(appointment.date, "HH:mm") === time,
    )
  }

  const isSlotOccupiedByAppointment = (barberId: number, time: string) => {
    return appointments.find((appointment) => {
      if (appointment.barberId !== barberId) return false

      const appointmentTime = format(appointment.date, "HH:mm")
      const [hour, minute] = appointmentTime.split(":").map(Number)
      const appointmentDate = new Date(0, 0, 0, hour, minute)
      const appointmentEndTime = format(
        addMinutes(appointmentDate, appointment.service.durationMinutes),
        "HH:mm",
      )

      return time >= appointmentTime && time < appointmentEndTime
    })
  }

  const isSlotAvailable = (barberId: number, time: string) => {
    return !isSlotOccupiedByAppointment(barberId, time)
  }

  const calculateSlotsForAppointment = (duration: number) => {
    return Math.ceil(duration / 10) // Cada slot é de 10 minutos
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock />
          <p>
            <span className="text-sm capitalize text-white">
              {format(new Date(), "EEEE, d", { locale: ptBR })}
            </span>
            <span className="text-sm text-white"> de </span>
            <span className="text-sm capitalize text-white">
              {format(new Date(), "MMMM", { locale: ptBR })}
            </span>
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-screen overflow-y-scroll [&::-webkit-scrollbar]:hidden">
          <div className="min-w-[800px]">
            {/* Header */}
            <div
              className={`mb-4 grid grid-cols-${barbers.length + 1} gap-2 border-b pb-4`}
            >
              <div className="p-2 font-semibold text-muted-foreground">
                Horário
              </div>
              {barbers.map((barber) => (
                <div key={barber.id} className="text-center">
                  <div className="flex items-center justify-center gap-4 font-semibold">
                    {!barber.imageUrl ? (
                      <User className="h-10 w-10 rounded-full bg-secondary p-2" />
                    ) : (
                      <div className="relative h-10 w-10">
                        <Image
                          src={barber?.imageUrl || ""}
                          alt={barber.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    {barber.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Grid de Horarios */}
            <div className="space-y-1 overflow-y-auto">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className={`grid grid-cols-${barbers.length + 1} gap-2`}
                >
                  <div className="border-r p-2 text-sm text-muted-foreground">
                    {time}
                  </div>
                  {barbers.map((barber) => {
                    const appointmentByBarber = getAppointmentByBarber(
                      barber.id,
                      time,
                    )
                    const isOccupied = isSlotOccupiedByAppointment(
                      barber.id,
                      time,
                    )
                    const isAvailable = !isOccupied

                    return (
                      <div
                        key={`${barber.id}-${time}`}
                        className="relative min-h-[40px]"
                      >
                        {appointmentByBarber ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <div
                                className={`absolute left-0 right-0 top-0 z-10 cursor-pointer overflow-hidden rounded border p-2 text-xs transition-opacity hover:opacity-80`}
                                style={{
                                  height: `${calculateSlotsForAppointment(appointmentByBarber.service.durationMinutes) * 41 - 1}px`,
                                }}
                              >
                                <div className="flex h-full flex-col justify-between overflow-hidden">
                                  <div className="min-h-0 flex-1">
                                    <div className="truncate font-semibold leading-tight">
                                      {appointmentByBarber.user.name}
                                    </div>
                                    <div className="truncate text-xs leading-tight">
                                      {appointmentByBarber.service.name}
                                    </div>
                                    <div className="mt-1 truncate text-xs leading-tight text-muted-foreground">
                                      {format(
                                        appointmentByBarber.date,
                                        "HH:mm",
                                        { locale: ptBR },
                                      )}{" "}
                                      -{" "}
                                      {format(
                                        addMinutes(
                                          appointmentByBarber.date,
                                          appointmentByBarber.service
                                            .durationMinutes,
                                        ),
                                        "HH:mm",
                                      )}
                                    </div>
                                  </div>
                                  <div className="mt-1 flex-shrink-0">
                                    <Badge
                                      variant="outline"
                                      className="max-w-full truncate text-xs"
                                    >
                                      Confirmado
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </DialogTrigger>
                          </Dialog>
                        ) : isAvailable ? (
                          <CalendarAppointmentForm />
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Calendar
