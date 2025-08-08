"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Service, User } from "@prisma/client"
import { Plus } from "lucide-react"
import { getFormattedCurrency } from "@/app/_helpers/format-currency"
import { createAppointment } from "@/app/_actions/create-appointments"
import { useState } from "react"
import { set } from "date-fns"
import { toast } from "sonner"

export interface CalendarAppointmentFormProps {
  barberName: string
  barberId: number
  time: string
  services: Service[]
  clients: User[]
  onAppointmentCreated?: () => void
}

const CalendarAppointmentForm = ({
  barberName,
  barberId,
  time,
  services,
  clients,
  onAppointmentCreated,
}: CalendarAppointmentFormProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isServicesDialogOpen, setIsServicesDialogOpen] = useState(false)

  const handleServiceCheckboxChange = (service: Service, checked: boolean) => {
    if (checked) {
      setSelectedServices((prev) => [...prev, service])
    } else {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id))
    }
  }

  const isServiceSelected = (service: Service) => {
    return selectedServices.some((s) => s.id === service.id)
  }

  const handleCreateAppointment = async () => {
    if (!selectedClientId || selectedServices.length === 0) {
      toast.error("Selecione um cliente e pelo menos um serviço")
      return
    }

    try {
      // Converter o horário para uma data completa
      const [hour, minute] = time.split(":").map(Number)
      const appointmentDate = set(new Date(), {
        hours: hour,
        minutes: minute,
        seconds: 0,
        milliseconds: 0,
      })

      await createAppointment({
        userId: selectedClientId,
        services: selectedServices,
        barberId: barberId,
        date: appointmentDate,
      })

      toast.success("Agendamento criado com sucesso!")
      if (onAppointmentCreated) {
        onAppointmentCreated()
      }

      setIsOpen(false)
      setSelectedClientId("")
      setSelectedServices([])
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar agendamento")
    }
  }

  const totalPrice = selectedServices.reduce(
    (sum, service) => sum + Number(service.price),
    0,
  )
  const totalDuration = selectedServices.reduce(
    (sum, service) => sum + service.durationMinutes,
    0,
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-full min-h-[40px] w-full border-2 border-dashed"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Profissional</Label>
            <Input value={barberName} disabled />
          </div>
          <div>
            <Label>Horário</Label>
            <Input value={time} disabled />
          </div>
          <div>
            <Label>Cliente</Label>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent className="bg-muted">
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Serviços</Label>
            <Dialog
              open={isServicesDialogOpen}
              onOpenChange={setIsServicesDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  {selectedServices.length > 0
                    ? `${selectedServices.length} serviço(s) selecionado(s)`
                    : "Selecionar Serviços"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Serviços</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={isServiceSelected(service)}
                        onCheckedChange={(checked) =>
                          handleServiceCheckboxChange(
                            service,
                            checked as boolean,
                          )
                        }
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`service-${service.id}`}
                          className="cursor-pointer text-sm font-medium"
                        >
                          {service.name}
                        </Label>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{service.durationMinutes} min</span>
                          <span>
                            R$ {getFormattedCurrency(Number(service.price))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsServicesDialogOpen(false)}
                  >
                    Fechar
                  </Button>
                  <Button onClick={() => setIsServicesDialogOpen(false)}>
                    Confirmar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {selectedServices.length > 0 && (
            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-medium">
                  {getFormattedCurrency(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Duração:</span>
                <span>{totalDuration} minutos</span>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleCreateAppointment}
              disabled={!selectedClientId || selectedServices.length === 0}
            >
              Criar agendamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CalendarAppointmentForm
