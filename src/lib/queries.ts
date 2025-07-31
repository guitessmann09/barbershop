"server only"

import { db } from "@/lib/prisma"

export const getData = async () => {
  const [services, barbers, appointments, users, availableDays, subscriptions] =
    await Promise.all([
      db.service.findMany(),
      db.barber.findMany({
        select: {
          id: true,
          name: true,
          imageUrl: true,
          employeeId: true,
          createdAt: true,
          updatedAt: true,
          appointments: {
            select: { date: true },
          },
        },
      }),
      db.appointment.findMany(),
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

  return {
    services,
    barbers,
    appointments,
    users,
    availableDays,
    subscriptions,
  }
}
