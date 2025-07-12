"server only"

import { db } from "@/lib/prisma"

export const getData = async () => {
  const [services, barbers, bookings, users, availableDays, subscriptions] =
    await Promise.all([
      db.service.findMany(),
      db.barber.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          imageURL: true,
          password: true,
          createdAt: true,
          updatedAt: true,
          bookings: {
            select: { date: true },
          },
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
      db.subscription.findMany({
        include: {
          benefits: true,
        },
      }),
    ])

  return { services, barbers, bookings, users, availableDays, subscriptions }
}
