import BookingItem from "@/components/booking-item"
import Header from "@/components/header"
import { redirect } from "next/navigation"
import { getData } from "@/lib/queries"
import {
  getConfirmedBookings,
  getCompletedBookings,
} from "@/app/_constants/get-bookings"
import getUserWithProvider from "../_helpers/get-user-with-provider"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getUserData } from "../_actions/get-user-data"

const Bookings = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  })
  if (!session?.user) {
    redirect("/")
  }

  const user = session ? await getUserData(session.session) : null

  const { bookings, services, barbers } = await getData()

  const confirmedBookings = await getConfirmedBookings(bookings)
  const completedBookings = await getCompletedBookings(bookings)

  return (
    <div>
      <Header {...user} />
      <div className="p-5 lg:px-32">
        <div>
          <h2 className="text-xl font-bold">Agendamentos</h2>
        </div>
        <div className="mt-3 flex flex-col gap-5 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
              Confirmados
            </h2>
            {!confirmedBookings.length && (
              <p className="text-sm text-gray-500">
                Nenhum agendamento confirmado
              </p>
            )}
            {confirmedBookings
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              )
              .map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={booking}
                  services={services}
                  barbers={barbers}
                />
              ))}
          </div>
          <div className="w-full space-y-2">
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
              Finalizados
            </h2>
            {!completedBookings.length && (
              <p className="text-sm text-gray-500">
                Nenhum agendamento finalizado
              </p>
            )}
            {completedBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={booking}
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

export default Bookings
