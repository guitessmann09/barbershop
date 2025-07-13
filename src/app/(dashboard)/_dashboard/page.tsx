import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getData } from "@/lib/queries"
import BarberBookingItem from "@/components/barber-booking-item"
import {
  getTodayBookings,
  getInComingBookings,
  getFutureBookings,
} from "../../_constants/get-bookings"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Header from "@/components/header"
import getUserWithProvider from "../../_helpers/get-user-with-provider"
import verifyProvider from "../../_helpers/verifyProvider"

const Dashboard = async () => {
  const session = await getServerSession(authOptions)
  if (!session || session.user.provider !== "credentials") {
    redirect("/barberlogin")
  }

  const { bookings, services, users } = await getData()

  const myBookings = bookings.filter(
    (booking) => booking.barberId === Number(session.user.id),
  )

  const user = session?.user?.id
    ? await getUserWithProvider({ userId: session.user.id })
    : null

  const todayBookings = getTodayBookings(myBookings)
  const inComingBookings = getInComingBookings(todayBookings)
  const futureBookings = getFutureBookings(myBookings)

  return (
    <div>
      <Header user={user} />
      <div className="p-5 lg:px-32">
        <h2 className="text-xl font-bold">Olá, {session.user.name}!</h2>
        <div className="mt-5 flex flex-col gap-5 md:flex-row">
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-muted-foreground">
                Agendamentos de hoje
              </h3>
              <div>
                <span className="text-sm capitalize text-gray-500">
                  {format(new Date(), "EEEE, d", { locale: ptBR })}
                </span>
                <span className="text-sm text-gray-500"> de </span>
                <span className="text-sm capitalize text-gray-500">
                  {format(new Date(), "MMMM", { locale: ptBR })}
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              {inComingBookings.length > 0 ? (
                inComingBookings.map((booking) => (
                  <BarberBookingItem
                    key={booking.id}
                    appointment={booking}
                    services={services}
                    users={users}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum agendamento para hoje.
                </p>
              )}
            </div>
          </div>
          {futureBookings.length > 0 && (
            <div className="w-full space-y-2">
              <h3 className="text-base font-semibold text-muted-foreground">
                Agendamentos futuros
              </h3>
              <div className="flex w-full flex-col gap-2">
                {futureBookings.map((booking) => (
                  <BarberBookingItem
                    key={booking.id}
                    appointment={booking}
                    services={services}
                    users={users}
                    isFuture={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
