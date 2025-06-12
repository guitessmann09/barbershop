import BookingItem from "@/components/booking-item"
import Header from "@/components/header"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { getData } from "@/lib/queries"
import {
  getConfirmedBookings,
  getCompletedBookings,
} from "@/app/_constants/get-bookings"

const Bookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/")
  }

  const { bookings, services, barbers } = await getData()

  const confirmedBookings = await getConfirmedBookings(bookings)
  const completedBookings = await getCompletedBookings(bookings)

  return (
    <div>
      <Header />
      <div className="p-5">
        <div>
          <h2 className="text-xl font-bold">Agendamentos</h2>
        </div>
        <div>
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
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
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
        <div>
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
  )
}

export default Bookings
