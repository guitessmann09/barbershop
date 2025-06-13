import { db } from "@/lib/prisma"

export const getData = async () => {
  const [services, barbers, bookings, users, availableDays] = await Promise.all(
    [
      db.service.findMany(),
      db.barber.findMany({
        select: {
          id: true,
          name: true,
          bookings: {
            select: { date: true },
          },
          imageURL: true,
        },
      }),
      db.booking.findMany(),
      db.user.findMany(),
      db.availability.findMany({
        select: {
          weekday: true,
          barberId: true,
        },
      }),
    ],
  )

  return { services, barbers, bookings, users, availableDays }
}
