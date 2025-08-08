"use client"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { addMinutes, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { StarIcon } from "lucide-react"
import { Appointment, Barber, Service } from "@prisma/client"
import { useState } from "react"
import EditAppointmentForm from "./edit-appointment-form"

export type AppointmentWithServicesAndUser = Appointment & {
  services: {
    service: Service
  }[]
  user: {
    name: string | null
    subscriptionId: number | null
  }
  barberName: string
  barbers: Barber[]
  allServices: Service[]
}

const CalendarAppointmentDialog = (
  appointmentByBarber: AppointmentWithServicesAndUser,
) => {
  const [isOpen, setIsOpen] = useState(false)
  const calculateSlotsForAppointment = (duration: number) => {
    return Math.ceil(duration / 10)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className={`absolute left-0 right-0 top-0 z-10 cursor-pointer overflow-hidden rounded border p-2 text-xs transition-opacity hover:opacity-80 ${
            appointmentByBarber.user.subscriptionId
              ? "bg-primary-foreground"
              : "bg-muted"
          }`}
          style={{
            height: `${calculateSlotsForAppointment(appointmentByBarber.services.reduce((sum: number, s: { service: Service }) => sum + s.service.durationMinutes, 0)) * 41 - 1}px`,
          }}
        >
          <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="min-h-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="truncate font-semibold leading-tight">
                  {appointmentByBarber.user.name || "Cliente"}
                </div>
                {appointmentByBarber.user.subscriptionId && (
                  <Badge>
                    <StarIcon className="text-muted" size={16} />
                  </Badge>
                )}
              </div>
              <div className="truncate text-xs leading-tight">
                {appointmentByBarber.services
                  .map((service: { service: Service }) => service.service.name)
                  .join(", ")}
              </div>
              <div className="mt-1 truncate text-xs leading-tight text-muted-foreground">
                {format(appointmentByBarber.date, "HH:mm", { locale: ptBR })} -{" "}
                {format(
                  addMinutes(
                    appointmentByBarber.date,
                    appointmentByBarber.services.reduce(
                      (sum: number, s: { service: Service }) =>
                        sum + s.service.durationMinutes,
                      0,
                    ),
                  ),
                  "HH:mm",
                )}
              </div>
            </div>
            <div className="mt-1 flex-shrink-0">
              <Badge
                className={
                  appointmentByBarber.date < new Date()
                    ? `bg-primary`
                    : `bg-green-100 text-green-800 hover:bg-green-100`
                }
              >
                {appointmentByBarber.date < new Date()
                  ? "Concluído"
                  : "Confirmado"}
              </Badge>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <EditAppointmentForm
          appointmentByBarber={appointmentByBarber}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CalendarAppointmentDialog
