"use client"

import { Appointment, Service, Barber } from "@prisma/client"
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

import { deleteAppointment } from "@/app/_actions/delete-appointments"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"

interface AppointmentItemProps {
  appointment: Appointment & {
    services: Service[]
  }
  services: Service[]
  barbers: Pick<Barber, "id" | "name" | "imageUrl">[]
}

const AppointmentItem = ({
  appointment,
  services,
  barbers,
}: AppointmentItemProps) => {
  const router = useRouter()
  const [cancelDialogIsOpen, setCancelDialogIsOpen] = useState(false)
  const [
    handleCancelAppointmentIsLoading,
    setHandleCancelAppointmentIsLoading,
  ] = useState(false)
  const serviceIsComplete = appointment.date < new Date()

  const handleCancelAppointment = async () => {
    try {
      setHandleCancelAppointmentIsLoading(true)
      await deleteAppointment({ id: appointment.id })
      toast.success("Agendamento cancelado com sucesso!")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar o agendamento.")
    } finally {
      setHandleCancelAppointmentIsLoading(false)
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
            {appointment.services[0]?.name || "Serviço não encontrado"}
          </h3>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image
                  src={
                    barbers.find((barber) => barber.id === appointment.barberId)
                      ?.imageUrl || ""
                  }
                  alt="Barber"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <p className="text-sm">
                {
                  barbers.find((barber) => barber.id === appointment.barberId)
                    ?.name
                }
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
                      onClick={handleCancelAppointment}
                      disabled={handleCancelAppointmentIsLoading}
                    >
                      {handleCancelAppointmentIsLoading ? (
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
            {format(appointment.date, "MMMM", { locale: ptBR })}
          </p>
          <p className="text-2xl">{appointment.date.getDate()}</p>
          <p className="text-sm">
            {format(appointment.date, "HH:mm", { locale: ptBR })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default AppointmentItem
