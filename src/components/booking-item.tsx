"use client"

import { Booking, Service, Barber } from "@prisma/client"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from "./ui/alert-dialog"

import { deleteBooking } from "@/app/_actions/delete-bookings"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
interface BookingItemProps {
  booking: Booking
  services: Service[]
  barbers: Pick<Barber, "id" | "name" | "imageURL">[]
}

const BookingItem = ({ booking, services, barbers }: BookingItemProps) => {
  const router = useRouter()
  const [cancelDialogIsOpen, setCancelDialogIsOpen] = useState(false)
  const [handleCancelBookingIsLoading, setHandleCancelBookingIsLoading] =
    useState(false)
  const serviceIsComplete = booking.date < new Date()

  const handleCancelBooking = async () => {
    try {
      setHandleCancelBookingIsLoading(true)
      await deleteBooking({ id: booking.id })
      toast.success("Agendamento cancelado com sucesso!")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar o agendamento.")
    } finally {
      setHandleCancelBookingIsLoading(false)
      setCancelDialogIsOpen(false)
    }
  }
  return (
    <Card className="mt-3 min-w-[100%]">
      <CardContent className="flex justify-between p-0">
        {/* ESQUERDA */}
        <div className="flex w-full flex-col gap-2 px-5 py-5">
          <Badge
            className="w-fit"
            variant={serviceIsComplete ? "secondary" : "default"}
          >
            {serviceIsComplete ? "Finalizado" : "Confirmado"}
          </Badge>
          <h3 className="font-semibold">
            {services.find((service) => service.id === booking.serviceId)?.name}
          </h3>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    barbers.find((barber) => barber.id === booking.barberId)
                      ?.imageURL || undefined
                  }
                />
                <AvatarFallback className="bg-gray-200 text-gray-500">
                  {barbers
                    .find((barber) => barber.id === booking.barberId)
                    ?.name.charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm">
                {barbers.find((barber) => barber.id === booking.barberId)?.name}
              </p>
            </div>
            {!serviceIsComplete ? (
              <AlertDialog
                open={cancelDialogIsOpen}
                onOpenChange={setCancelDialogIsOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 text-xs text-red-500 hover:bg-transparent hover:text-red-500"
                  >
                    Cancelar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[90%] rounded-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-xs font-semibold">
                      Tem certeza que deseja cancelar o agendamento?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex w-full flex-row justify-end gap-4">
                    <AlertDialogCancel asChild className="m-0">
                      <Button variant="outline" className="rounded-lg">
                        Cancelar
                      </Button>
                    </AlertDialogCancel>
                    <Button
                      variant="destructive"
                      className="rounded-lg"
                      onClick={handleCancelBooking}
                      disabled={handleCancelBookingIsLoading}
                    >
                      {handleCancelBookingIsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Confirmar"
                      )}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
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
