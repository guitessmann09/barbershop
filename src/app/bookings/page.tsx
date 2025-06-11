import BookingItem from "@/components/booking-item"
import Header from "@/components/header"
import { db } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const Bookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/")
  }
  const bookings = await db.booking.findMany({
    where: {
      userId: (session as any).user.id,
    },
  })
  const services = await db.service.findMany({})
  const barbers = await db.barber.findMany({
    select: {
      id: true,
      name: true,
      imageURL: true,
    },
  })

  return (
    <div>
      <Header />
      <div className="p-5">
        <div>
          <h2 className="text-xl font-bold">Agendamentos</h2>
        </div>
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
          Confirmados
        </h2>
        {bookings
          .sort((a, b) => b.date.getTime() - a.date.getTime())
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

export default Bookings
