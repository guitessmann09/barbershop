import AppointmentItem from "@/components/appointment-item"
import Header from "@/components/header"
import { redirect } from "next/navigation"
import { getData } from "@/lib/queries"
import {
  getConfirmedAppointments,
  getCompletedAppointments,
} from "@/app/_constants/get-appointments"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getUserData } from "../_actions/get-user-data"

const Appointments = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  })
  if (!session?.user) {
    redirect("/home")
  }

  const { appointments, services, barbers } = await getData()

  const confirmedAppointments = await getConfirmedAppointments(appointments)
  const completedAppointments = await getCompletedAppointments(appointments)

  return (
    <div>
      {/* Removido o prop 'user' pois o componente Header não aceita essa propriedade */}
      <Header />
      <div className="p-5 lg:px-32">
        <div>
          <h2 className="text-xl font-bold">Agendamentos</h2>
        </div>
        <div className="mt-3 flex flex-col gap-5 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
              Confirmados
            </h2>
            {!confirmedAppointments.length && (
              <p className="text-sm text-gray-500">
                Nenhum agendamento confirmado
              </p>
            )}
            {confirmedAppointments
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
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
          <div className="w-full space-y-2">
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
              Finalizados
            </h2>
            {!completedAppointments.length && (
              <p className="text-sm text-gray-500">
                Nenhum agendamento finalizado
              </p>
            )}
            {completedAppointments.map((appointment) => (
              <AppointmentItem
                key={appointment.id}
                appointment={appointment}
                services={services}
                barbers={barbers}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointments
