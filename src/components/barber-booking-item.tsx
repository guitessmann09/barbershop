"use client"

import {
  Clock,
  Scissors,
  Phone,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  UserIcon,
  Calendar,
} from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { Booking, Service, User } from "@prisma/client"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Avatar } from "./ui/avatar"
import { AvatarImage } from "./ui/avatar"
import { AvatarFallback } from "./ui/avatar"
import { deleteBooking } from "@/app/_actions/delete-bookings"
import { toast } from "sonner"

interface BarberBookingItemProps {
  appointment: Booking
  services: Service[]
  users: User[]
  isFuture?: boolean
}

const BarberBookingItem = ({
  appointment,
  services,
  users,
  isFuture = false,
}: BarberBookingItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleCancelRequest = () => {
    setShowCancelDialog(true)
  }

  const handleCancelBooking = async () => {
    try {
      await deleteBooking({ id: appointment.id })
      toast.success("Agendamento cancelado com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar o agendamento.")
    }
  }

  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ptBR })
  }

  const userName = users.find((user) => user.id === appointment.userId)?.name

  const serviceName = services.find(
    (service) => service.id === appointment.serviceId,
  )?.name

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300">
        <CardContent className="p-0 md:p-4">
          <div className="cursor-pointer p-4" onClick={handleToggle}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        users.find((user) => user.id === appointment.userId)
                          ?.image || ""
                      }
                    />
                    <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-base font-normal text-muted-foreground">
                    {userName}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 md:flex-col md:items-start">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{formatTime(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scissors className="h-4 w-4 text-primary" />
                    <span>{serviceName}</span>
                  </div>
                  {isFuture && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        {format(appointment.date, "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="bg-muted/30 border-t p-4 duration-300 animate-in slide-in-from-top">
              <Button
                variant="destructive"
                onClick={handleCancelRequest}
                className="flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                Solicitar Cancelamento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="w-[90%] rounded-xl p-5">
          <DialogHeader>
            <DialogTitle>Cancelar Agendamento</DialogTitle>
            <DialogDescription>
              Você está cancelando o agendamento de {userName} às{" "}
              {formatTime(appointment.date)}
              {isFuture
                ? " no dia " +
                  format(appointment.date, "dd/MM/yyyy", { locale: ptBR })
                : ""}
              . Por favor, informe o motivo do cancelamento.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cancel-reason">Motivo do Cancelamento</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Informe o motivo do cancelamento..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              className="w-full rounded-lg"
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              disabled={!cancelReason.trim()}
              onClick={handleCancelBooking}
              className="w-full rounded-lg"
            >
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BarberBookingItem
