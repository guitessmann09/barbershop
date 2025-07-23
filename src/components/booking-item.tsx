"use client"

import { Booking, Service, Barber } from "@prisma/client"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
} from "./ui/alert-dialog"

import { deleteBooking } from "@/app/_actions/delete-bookings"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"

interface BookingItemProps {
  booking: Booking
  services: Service[]
  barbers: Pick<Barber, "id" | "name" | "imageUrl">[]
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
    <Card className="mt-3 min-w-[100%] md:min-w-[90%]">
      <CardContent className="flex justify-between p-0">
        {/* ESQUERDA */}
        <div className="flex w-full flex-col gap-2 p-5">
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
              <div className="relative h-8 w-8">
                <Image
                  src={
                    barbers.find((barber) => barber.id === booking.barberId)
                      ?.imageUrl || ""
                  }
                  alt="Barber"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
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
                  <AlertDialogHeader className="text-center">
                    <AlertDialogTitle className="text-base font-bold">
                      Cancelar Agendamento
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground">
                      Tem certeza que deseja cancelar o agendamento?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex w-full flex-row justify-center gap-4">
                    <AlertDialogCancel asChild className="m-0">
                      <Button
                        variant="outline"
                        className="w-full rounded-lg p-2"
                      >
                        Cancelar
                      </Button>
                    </AlertDialogCancel>
                    <Button
                      variant="destructive"
                      className="w-full rounded-lg p-2"
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
            {format(booking.date, "MMMM", { locale: ptBR })}
          </p>
          <p className="text-2xl">{booking.date.getDate()}</p>
          <p className="text-sm">
            {format(booking.date, "HH:mm", { locale: ptBR })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingItem
