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
                  <Card key={booking.id} className="mt-3 min-w-[100%]">
                    <CardContent className="flex justify-between p-0">
                      <div className="flex w-full flex-col gap-4 p-5">
                        <h3 className="text-lg font-bold">
                          {
                            services.find(
                              (service) => service.id === booking.serviceId,
                            )?.name
                          }
                        </h3>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                users.find((user) => user.id === booking.userId)
                                  ?.image || undefined
                              }
                            />
                            <AvatarFallback className="bg-gray-200 text-gray-500">
                              {users
                                .find((user) => user.id === booking.userId)
                                ?.name?.charAt(0)
                                .toUpperCase() || undefined}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm text-muted-foreground">
                            {
                              users.find((user) => user.id === booking.userId)
                                ?.name
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center border-l-2 border-solid px-8 py-6">
                        <p className="text-sm capitalize">
                          {booking.date.toLocaleString("pt-BR", {
                            month: "long",
                          })}
                        </p>
                        <p className="text-2xl">{booking.date.getDate()}</p>
                        <p className="text-sm">
                          {booking.date.toLocaleString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
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
