"use client"

import { Service } from "@prisma/client"
import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet"
import { useState } from "react"
import { createBooking } from "@/app/_actions/create-bookings"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { BookingForm } from "./booking-form"
import { ServiceItemProps, BookingFormData } from "@/types/barbershop"
import { set } from "date-fns"
import LoginDialog from "./login-dialog"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { LogInIcon } from "lucide-react"

const ServiceItem = ({ service, barbers }: ServiceItemProps) => {
  const router = useRouter()
  const { data } = useSession()
  const [formData, setFormData] = useState<BookingFormData>({
    selectedDay: undefined,
    selectedTime: undefined,
    selectedBarber: undefined,
  })

  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  const handleBookingSheetOpenChange = () => {
    setFormData({
      selectedDay: undefined,
      selectedTime: undefined,
      selectedBarber: undefined,
    })
    setBookingSheetIsOpen(false)
  }

  const handleCreateBooking = async () => {
    const { selectedDay, selectedTime, selectedBarber } = formData
    if (!selectedDay || !selectedTime || !selectedBarber) return

    try {
      const hour = Number(selectedTime.split(":")[0])
      const minute = Number(selectedTime.split(":")[1])
      const newDate = set(selectedDay, {
        hours: hour,
        minutes: minute,
      })

      await createBooking({
        serviceId: service.id,
        barberId: selectedBarber?.id,
        date: newDate,
      })

      router.refresh()
      toast.success("Agendamento feito com sucesso")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao fazer o agendamento")
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
          <Image
            alt={service.name}
            src={service.imageURL}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold">{service.name}</h3>
          <p className="text-sm text-gray-500">{service.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-primary">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>
            <Sheet
              open={bookingSheetIsOpen}
              onOpenChange={handleBookingSheetOpenChange}
            >
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBookingSheetIsOpen(true)}
              >
                Agendar
              </Button>
              <SheetContent className="h-full w-[85%] px-0">
                {data?.user ? (
                  <>
                    <BookingForm
                      service={service}
                      barbers={barbers}
                      formData={formData}
                      onDaySelect={(date) =>
                        setFormData((prev) => ({ ...prev, selectedDay: date }))
                      }
                      onTimeSelect={(time) =>
                        setFormData((prev) => ({ ...prev, selectedTime: time }))
                      }
                      onBarberSelect={(barber) =>
                        setFormData((prev) => ({
                          ...prev,
                          selectedBarber: barber,
                        }))
                      }
                      onSubmit={handleCreateBooking}
                    />
                    <div className="mt-5 px-5">
                      <Button
                        className="w-full"
                        disabled={
                          !formData.selectedTime ||
                          !formData.selectedDay ||
                          !formData.selectedBarber
                        }
                        onClick={() => {
                          handleCreateBooking()
                          handleBookingSheetOpenChange()
                        }}
                      >
                        Confirmar
                      </Button>
                    </div>
                  </>
                ) : (
                  <LoginDialog />
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceItem
