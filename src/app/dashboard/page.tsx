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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@/components/ui/avatar"
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
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Seus agendamentos</h3>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            {myBookings.length > 0 ? (
              <div className="flex flex-col gap-2">
                {myBookings.map((booking) => (
                  <BarberBookingItem
                    key={booking.id}
                    appointment={booking}
                    services={services}
                    users={users}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Você ainda não tem agendamentos
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
