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
        },
      }),
      db.user.findMany(),
      db.subscription.findMany({
        include: {
          benefits: true,
        },
      }),
    ])

  // Mapeia appointments para que cada services seja um array de objetos completos do serviço
  const appointmentsWithServices = appointments.map((a) => ({
    ...a,
    services: a.services.map((s) => s.service),
  }))

  return {
    services,
    barbers,
    appointments: appointmentsWithServices,
    users,
    subscriptions,
  }
}
