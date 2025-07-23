import { Service, Barber } from "@prisma/client"

export interface BarberWithBookings
  extends Pick<Barber, "id" | "name" | "imageUrl"> {
  bookings: { date: Date }[]
}

export interface ServiceItemProps {
  service: Service
  barbers: BarberWithBookings[]
  availableDays: { weekday: number; barberId: number }[]
}

export interface BookingFormData {
  selectedDay: Date | undefined
  selectedTime: string | undefined
  selectedBarber: Barber | undefined
}
