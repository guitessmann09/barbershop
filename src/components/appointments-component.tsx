import { Barber, Appointment, Service } from "@prisma/client"
import AppointmentItem from "./appointment-item"

type AppointmentWithServices = Appointment & {
  services: Service[]
}

interface AppointmentComponentProps {
  confirmedAppointments: AppointmentWithServices[]
  services: Service[]
  barbers: Barber[]
}

const AppointmentComponent = ({
  confirmedAppointments,
  services,
  barbers,
}: AppointmentComponentProps) => {
  return (
    <div>
      {confirmedAppointments.length >= 0 && (
        <h2 className="mt-6 text-xs font-bold uppercase text-gray-500">
          Agendamentos
        </h2>
      )}
      <div className="flex gap-4 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
        {confirmedAppointments
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
          .map((appointment) => (
            <AppointmentItem
              key={appointment.id}
              appointment={appointment}
              services={services}
              barbers={barbers}
            />
          ))}
      </div>
    </div>
  )
}

export default AppointmentComponent
