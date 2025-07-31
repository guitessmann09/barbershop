import { Service, Barber } from "@prisma/client"

export interface BarberWithAppointments
  extends Pick<Barber, "id" | "name" | "imageUrl"> {
  appointments: { date: Date }[]
}

export interface ServiceItemProps {
  service: Service
  barbers: BarberWithAppointments[]
  availableDays: { weekday: number; barberId: number }[]
}

export interface AppointmentFormData {
  selectedDay: Date | undefined
  selectedTime: string | undefined
  selectedBarber: Barber | undefined
}
