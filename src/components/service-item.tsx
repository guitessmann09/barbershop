"use client"

import { Service, Barber } from "@prisma/client"
import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { format, set } from "date-fns"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import { Toggle } from "./ui/toggle"
import { createBooking } from "@/app/_actions/create-bookings"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface ServiceItemProps {
  service: Service
  barbers: Pick<Barber, "id" | "name">[]
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
]

const ServiceItem = ({ service, barbers }: ServiceItemProps) => {
  const { data } = useSession()
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>(
    undefined,
  )
  const handleSelectDay = (day: Date | undefined) => {
    setSelectedDay(day)
  }

  const handleSelectTime = (time: string) => {
    setSelectedTime(time)
  }

  const handleSelectBarber = (barber: Barber) => {
    setSelectedBarber(barber)
  }

  const handleCreateBooking = async () => {
    if (!selectedDay || !selectedTime || !selectedBarber) return

    try {
      const hour = Number(selectedTime.split(":")[0])
      const minute = Number(selectedTime.split(":")[1])
      const newDate = set(selectedDay, {
        hours: hour,
        minutes: minute,
      })

      const booking = await createBooking({
        serviceId: service.id,
        userId: (data?.user as any).id,
        barberId: selectedBarber?.id,
        date: newDate,
      })

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
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline">
                  Agendar
                </Button>
              </SheetTrigger>
              <SheetContent className="h-full w-[85%] px-0">
                {selectedBarber && (
                  <div className="border-b border-solid py-5">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={selectedDay}
                      onSelect={handleSelectDay}
                      className="rounded-lg"
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>
                )}

                {selectedBarber && selectedDay && (
                  <div className="flex gap-3 overflow-x-scroll border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                    {TIME_LIST.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="w-full rounded-full border"
                        onClick={() => handleSelectTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="flex flex-col items-start justify-center border-b border-solid p-5">
                  <h2 className="mb-2 text-sm font-bold">
                    Selecione um profissional:
                  </h2>
                  <div className="flex w-full items-center justify-center">
                    <Carousel className="w-[80%]">
                      <CarouselContent>
                        {Array.from({ length: barbers.length }).map(
                          (_, index) => (
                            <CarouselItem key={barbers[index].id}>
                              <Toggle
                                pressed={
                                  selectedBarber?.name === barbers[index].name
                                }
                                onPressedChange={() =>
                                  setSelectedBarber(barbers[index] as Barber)
                                }
                                className={`flex w-full items-center gap-6 border p-6 transition hover:text-white ${
                                  selectedBarber?.id === barbers[index].id
                                    ? "flex w-full items-center gap-6 border p-6 transition hover:text-white"
                                    : "border-transparent hover:bg-secondary"
                                } `}
                                onClick={() => {
                                  handleSelectBarber(barbers[index] as Barber)
                                  setSelectedTime(undefined)
                                  setSelectedDay(undefined)
                                }}
                              >
                                <Image
                                  src="https://github.com/shadcn.png"
                                  alt={barbers[index].name}
                                  width={38}
                                  height={38}
                                  className="rounded-full"
                                />
                                <p className="text-lg font-semibold">
                                  {barbers[index].name}
                                </p>
                              </Toggle>
                            </CarouselItem>
                          ),
                        )}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </div>

                {selectedBarber && selectedDay && selectedTime && (
                  <div className="p-5">
                    <Card>
                      <CardContent className="space-y-3 p-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm font-bold">{service.name}</h2>
                          <p className="text-sm font-bold">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm text-muted-foreground">
                            Data
                          </h2>
                          <p className="text-sm">
                            {format(selectedDay, "d 'de' MMMM", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm text-muted-foreground">
                            Horário
                          </h2>
                          <p className="text-sm">{selectedTime}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm text-muted-foreground">
                            Profissional
                          </h2>
                          <p className="text-sm">{selectedBarber?.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                <SheetFooter className="mt-5 px-5">
                  <SheetClose asChild>
                    <Button
                      disabled={
                        !selectedTime || !selectedDay || !selectedBarber
                      }
                      type="submit"
                      onClick={handleCreateBooking}
                    >
                      Confirmar
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default ServiceItem
