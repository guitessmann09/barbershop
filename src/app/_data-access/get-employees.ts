"server only"
import { db } from "@/lib/prisma"
import { User, Employee, Barber, Availability } from "@prisma/client"

interface BarberWithAvailabilities extends Barber {
  availabilities: Availability[]
}

export interface EmployeeUser extends User {
  employee: Employee | null
  barber: BarberWithAvailabilities | null
}

export const getEmployees = async (): Promise<EmployeeUser[]> => {
  const userEmployees = await db.user.findMany({
    where: {
      employee: {
        isNot: null,
      },
    },
    include: {
      employee: true,
      barber: { include: { availabilities: true } },
    },
  })
  return userEmployees
}
