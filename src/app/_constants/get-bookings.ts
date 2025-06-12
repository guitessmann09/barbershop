import { authOptions } from "@/lib/auth"
import { Booking } from "@prisma/client"
import { getServerSession } from "next-auth"

const getUserBookings = async (bookings: Booking[]) => {
  const session = await getServerSession(authOptions)
  return bookings.filter(
    (booking) => booking.userId === (session as any).user.id,
  )
}

export const getConfirmedBookings = async (bookings: Booking[]) => {
  const userBookings = await getUserBookings(bookings)
  return userBookings
    .filter((booking) => booking.date > new Date())
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}

export const getCompletedBookings = async (bookings: Booking[]) => {
  const userBookings = await getUserBookings(bookings)
  return userBookings
    .filter((booking) => booking.date < new Date())
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}
