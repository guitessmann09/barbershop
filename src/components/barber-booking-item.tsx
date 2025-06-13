"use client"

import {
  Clock,
  Scissors,
  Phone,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  UserIcon,
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

interface BarberBookingItemProps {
  appointment: Booking
  services: Service[]
  users: User[]
}

const BarberBookingItem = ({
  appointment,
  services,
  users,
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

  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ptBR })
  }

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300">
        <CardContent className="p-0">
          <div className="cursor-pointer p-4" onClick={handleToggle}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {users.find((user) => user.id === appointment.userId)?.name}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatTime(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scissors className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {
                        services.find(
                          (service) => service.id === appointment.serviceId,
                        )?.name
                      }
                    </span>
                  </div>
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
              Você está cancelando o agendamento de{" "}
              {users.find((user) => user.id === appointment.userId)?.name} às{" "}
              {formatTime(appointment.date)}. Por favor, informe o motivo do
              cancelamento.
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
              onClick={() => {}}
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
