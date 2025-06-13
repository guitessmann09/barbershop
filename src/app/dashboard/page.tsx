import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { DialogTrigger } from "@/components/ui/dialog"
import LogoutDialog from "@/components/logout-dialog"
import { LogOutIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getData } from "@/lib/queries"
import BarberBookingItem from "@/components/barber-booking-item"

const Dashboard = async () => {
  const session = await getServerSession(authOptions)
  if (!session || session.user.provider !== "credentials") {
    redirect("/barberlogin")
  }

  const { bookings, services, users } = await getData()

  const myBookings = bookings.filter(
    (booking) => booking.barberId === Number(session.user.id),
  )

  const today = new Date()
  const todayString = today.toLocaleDateString("pt-BR")

  const todayBookings = myBookings.filter((booking) => {
    const bookingDate = new Date(booking.date)
    return bookingDate.toLocaleDateString("pt-BR") === todayString
  })

  const futureBookings = myBookings.filter((booking) => {
    const bookingDate = new Date(booking.date)
    console.log(bookingDate.toLocaleDateString("pt-BR"))
    return bookingDate.toLocaleDateString("pt-BR") > todayString
  })

  console.log(futureBookings)

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <Image src="/logo.png" alt="Dandy's Den" width={130} height={130} />
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="cursor-pointer">
              <LogOutIcon size={18} />
            </Button>
          </DialogTrigger>
          <LogoutDialog />
        </Dialog>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-bold">Olá, {session.user.name}!</h2>
        <div className="mt-5 flex flex-col gap-5 md:flex-row">
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-muted-foreground">
                Agendamentos de hoje
              </h3>
              <p className="text-sm text-muted-foreground">
                {today.toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2">
              {todayBookings
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((booking) => (
                  <BarberBookingItem
                    key={booking.id}
                    appointment={booking}
                    services={services}
                    users={users}
                  />
                ))}
            </div>
          </div>
          <div className="w-full space-y-2">
            <h3 className="text-base font-semibold text-muted-foreground">
              Agendamentos futuros
            </h3>
            <div className="flex w-full flex-col gap-2">
              {futureBookings
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((booking) => (
                  <BarberBookingItem
                    key={booking.id}
                    appointment={booking}
                    services={services}
                    users={users}
                    isFuture={true}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
