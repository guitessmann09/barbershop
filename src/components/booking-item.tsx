"use client"

import { Booking, Service, Barber } from "@prisma/client"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"
import { useSession } from "next-auth/react"
interface BookingItemProps {
  booking: Booking
  services: Service[]
  barbers: Pick<Barber, "id" | "name" | "imageURL">[]
}

const BookingItem = ({ booking, services, barbers }: BookingItemProps) => {
  const { data } = useSession()

  if (!data?.user || !booking?.id) {
    return (
      <div className="mt-3">
        <p className="text-sm text-gray-500">Você ainda não tem agendamentos</p>
      </div>
    )
  }

  return (
    <Card className="mt-3">
      <CardContent className="flex justify-between p-0">
        {/* ESQUERDA */}
        <div className="flex flex-col gap-2 py-5 pl-5">
          <Badge className="w-fit">Confirmado</Badge>
          <h3 className="font-semibold">
            {services.find((service) => service.id === booking.serviceId)?.name}
          </h3>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  barbers.find((barber) => barber.id === booking.barberId)
                    ?.imageURL || undefined
                }
              />
            </Avatar>
            <p className="text-sm">
              {barbers.find((barber) => barber.id === booking.barberId)?.name}
            </p>
          </div>
        </div>

        {/* DIREITA */}
        <div className="flex flex-col items-center justify-center border-l-2 border-solid px-8 py-6">
          <p className="text-sm capitalize">
            {booking.date.toLocaleString("pt-BR", { month: "long" })}
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
  )
}

export default BookingItem
