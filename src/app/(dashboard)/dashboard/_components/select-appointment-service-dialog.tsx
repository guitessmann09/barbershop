"use client"

import { getFormattedCurrency } from "@/app/_helpers/format-currency"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Service } from "@prisma/client"
import { ReactNode, useState, useEffect } from "react"

interface SelectAppointmentServiceDialogProps {
  children: ReactNode
  allServices: Service[]
  prevSelectedServices: Service[]
  onServicesChange?: (services: Service[]) => void
}

const SelectAppointmentServiceDialog = ({
  children,
  allServices,
  prevSelectedServices,
  onServicesChange,
}: SelectAppointmentServiceDialogProps) => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Inicializa os serviços selecionados com os previamente selecionados
  useEffect(() => {
    if (isOpen) {
      setSelectedServices(prevSelectedServices)
    }
  }, [prevSelectedServices, isOpen])

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

  const handleConfirm = () => {
    onServicesChange?.(selectedServices)
    setIsOpen(false)
  }

  const handleCancel = () => {
    // Restaura os serviços originais ao cancelar
    setSelectedServices(prevSelectedServices)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Serviços</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {allServices.map((service) => (
            <div key={service.id} className="flex items-center space-x-3">
              <Checkbox
                id={`service-${service.id}`}
                checked={isServiceSelected(service)}
                onCheckedChange={(checked) =>
                  handleServiceCheckboxChange(service, checked as boolean)
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
                  <span>R$ {getFormattedCurrency(Number(service.price))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SelectAppointmentServiceDialog
