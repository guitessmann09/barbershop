import { auth } from "@/lib/auth"
import { Booking } from "@prisma/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { headers } from "next/headers"

const getUserBookings = async (bookings: Booking[]) => {
  const session = await auth.api.getSession({
    headers: headers(),
  })
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
const todayString = format(today, "dd/MM/yyyy", { locale: ptBR })

export const getTodayBookings = (myBookings: Booking[]) =>
  myBookings
    .filter((booking) => {
      const bookingDate = new Date(booking.date)
      return format(bookingDate, "dd/MM/yyyy", { locale: ptBR }) === todayString
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
      return format(bookingDate, "dd/MM/yyyy", { locale: ptBR }) > todayString
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
