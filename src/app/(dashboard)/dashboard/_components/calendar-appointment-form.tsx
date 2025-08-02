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
import { Service, User } from "@prisma/client"
import { Plus } from "lucide-react"
import { getFormattedCurrency } from "@/app/_helpers/format-currency"

interface CalendarAppointmentFormProps {
  barberName: string
  time: string
  services: Service[]
  clients: User[]
}

const CalendarAppointmentForm = ({
  barberName,
  time,
  services,
  clients,
}: CalendarAppointmentFormProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-full min-h-[40px] w-full border-2 border-dashed"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
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
            <Select>
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
          <div>
            <Label htmlFor="service">Serviço</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent className="bg-muted">
                {services.map((service) => (
                  <SelectItem key={service.name} value={service.name}>
                    {service.name} ({service.durationMinutes}min) - R${" "}
                    {getFormattedCurrency(Number(service.price))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CalendarAppointmentForm
