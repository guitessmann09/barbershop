import { Barber, Booking, Service } from "@prisma/client"
import { Session } from "next-auth"
import BookingItem from "./booking-item"

interface BookingComponentProps {
  session: Session
  confirmedBookings: Booking[]
  services: Service[]
  barbers: Barber[]
}

const BookingComponent = ({
  session,
  confirmedBookings,
  services,
  barbers,
}: BookingComponentProps) => {
  return (
    <div>
      <h2 className="mt-6 text-xs font-bold uppercase text-gray-500">
        Agendamentos
      </h2>
      {!session || !confirmedBookings.length ? (
        <div className="mt-3">
          <p className="text-sm text-gray-500">
            Você ainda não tem agendamentos
          </p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
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
      )}
    </div>
  )
}

export default BookingComponent
