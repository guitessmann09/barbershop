import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/prisma"
import { Clock, User } from "lucide-react"
import Image from "next/image"
import { addMinutes, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import CalendarAppointmentDialog from "./calendar-appointment-card"
import CalendarAppointmentForm from "./calendar-appointment-form"

const Calendar = async () => {
  const barbers = await db.barber.findMany({})
  const appointments = await db.appointment.findMany({
    include: {
      services: {
        include: {
          service: true,
        },
      },
      user: {
        select: {
          name: true,
          subscriptionId: true,
        },
      },
    },
  })
  const services = await db.service.findMany({})
  const clients = await db.user.findMany({
    where: {
      employee: null,
    },
  })

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
        format(appointment.date, "HH:mm", { locale: ptBR }) === time &&
        format(appointment.date, "dd/MM/yyyy", { locale: ptBR }) ===
          format(new Date(), "dd/MM/yyyy", { locale: ptBR }),
    )
  }

  const isSlotOccupiedByAppointment = (barberId: number, time: string) => {
    return appointments.find((appointment) => {
      if (appointment.barberId !== barberId) return false

      const appointmentTime = format(appointment.date, "HH:mm", {
        locale: ptBR,
      })
      const [hour, minute] = appointmentTime.split(":").map(Number)
      const appointmentDate = new Date(0, 0, 0, hour, minute)
      const totalDuration = appointment.services.reduce(
        (sum, service) => sum + service.service.durationMinutes,
        0,
      )
      const appointmentEndTime = format(
        addMinutes(appointmentDate, totalDuration),
        "HH:mm",
        { locale: ptBR },
      )

      return (
        time >= appointmentTime &&
        time < appointmentEndTime &&
        format(appointment.date, "dd/MM/yyyy", { locale: ptBR }) ===
          format(new Date(), "dd/MM/yyyy", { locale: ptBR })
      )
    })
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-4">
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
        <div
          className={`mb-4 grid gap-2 border-b pb-4`}
          style={{
            gridTemplateColumns: `minmax(60px, auto) repeat(${barbers.length}, minmax(0, 1fr))`,
          }}
        >
          <div className="p-2 font-semibold text-muted-foreground">Horário</div>
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
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <div className="min-w-[800px]">
            {/* Grid de Horarios */}
            <div className="space-y-1">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className={`grid gap-2`}
                  style={{
                    gridTemplateColumns: `minmax(60px, auto) repeat(${barbers.length}, minmax(0, 1fr))`,
                  }}
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
                        {appointmentByBarber &&
                        appointmentByBarber.user.name ? (
                          <CalendarAppointmentDialog
                            {...appointmentByBarber}
                            barberName={barber.name}
                            barbers={barbers}
                            allServices={services}
                          />
                        ) : isAvailable ? (
                          <CalendarAppointmentForm
                            barberName={barber.name}
                            barberId={barber.id}
                            time={time}
                            services={services}
                            clients={clients}
                          />
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
