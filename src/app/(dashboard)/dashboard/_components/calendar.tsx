import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/prisma"
import { Clock, User } from "lucide-react"
import Image from "next/image"
import { addMinutes, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Separator } from "@/components/ui/separator"
import { Barber } from "@prisma/client"
import { Dialog } from "@radix-ui/react-dialog"
import { createAppointment } from "@/app/_actions/create-appointments"

const Calendar = async () => {
  const barbers = await db.barber.findMany({})
  const appointments = await db.appointment.findMany({
    include: {
      service: {
        select: {
          durationMinutes: true,
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
          <div className="">
            <div className={`mb-4 grid grid-cols-${barbers.length + 1} gap-2`}>
              <div className="p-2 text-sm font-semibold text-muted-foreground">
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
                          <Dialog></Dialog>
                        ) : isAvailable ? (
                          <Dialog></Dialog>
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
