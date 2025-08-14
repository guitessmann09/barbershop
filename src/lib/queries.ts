"server only"

import { db } from "@/lib/prisma"

export const getData = async () => {
  const [services, barbers, appointments, users, subscriptions] =
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
      db.appointment.findMany({
        include: {
          services: {
            include: {
              service: true,
            },
          },
          user: true,
        },
      }),
      db.user.findMany({
        include: { employee: true },
      }),
      db.subscription.findMany({
        include: {
          benefits: true,
        },
      }),
    ])
  const appointmentsWithServices = appointments.map((a) => ({
    ...a,
    services: a.services.map((s) => s.service),
  }))

  const clients = users.filter((user) => {
    return user.employee === null
  })

  return {
    services,
    barbers,
    appointments: appointmentsWithServices,
    users,
    subscriptions,
    clients,
  }
}
