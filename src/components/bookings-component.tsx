import { Barber, Booking, Service } from "@prisma/client"
import BookingItem from "./booking-item"

interface BookingComponentProps {
  confirmedBookings: Booking[]
  services: Service[]
  barbers: Barber[]
}

const BookingComponent = ({
  confirmedBookings,
  services,
  barbers,
}: BookingComponentProps) => {
  return (
    <div>
      {confirmedBookings.length >= 0 && (
        <h2 className="mt-6 text-xs font-bold uppercase text-gray-500">
          Agendamentos
        </h2>
      )}
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
    </div>
  )
}

export default BookingComponent
