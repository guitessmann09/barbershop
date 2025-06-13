import { authOptions } from "@/lib/auth"
import { Booking } from "@prisma/client"
import { getServerSession } from "next-auth"

const getUserBookings = async (bookings: Booking[]) => {
  const session = await getServerSession(authOptions)
  return bookings.filter(
    (booking) => booking.userId === (session as any)?.user.id,
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

const today = new Date()
const todayString = today.toLocaleDateString("pt-BR")

export const getTodayBookings = (myBookings: Booking[]) =>
  myBookings
    .filter((booking) => {
      const bookingDate = new Date(booking.date)
      return bookingDate.toLocaleDateString("pt-BR") === todayString
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

export const getInComingBookings = (todayBookings: Booking[]) =>
  todayBookings
    .filter((booking) => {
      const bookingDate = new Date(booking.date)
      return bookingDate.getTime() > today.getTime()
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

export const getFutureBookings = (myBookings: Booking[]) =>
  myBookings
    .filter((booking) => {
      const bookingDate = new Date(booking.date)
      return bookingDate.toLocaleDateString("pt-BR") > todayString
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
