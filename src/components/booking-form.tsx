"use client"

import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { format, set, isEqual, addDays, isSameDay, isAfter } from "date-fns"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Toggle } from "./ui/toggle"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import { BookingFormData, BarberWithBookings } from "@/types/barbershop"
import { Service, Barber } from "@prisma/client"
import { useMemo } from "react"

const TIME_LIST = [
  "08:00",
  "08:45",
  "09:30",
  "10:15",
  "11:00",
  "11:45",
  "12:30",
  "13:15",
  "14:00",
  "14:45",
  "15:30",
  "16:15",
  "17:00",
  "17:45",
  "18:30",
  "19:15",
]

interface BookingFormProps {
  service: Service
  barbers: BarberWithBookings[]
  formData: BookingFormData
  onDaySelect: (date: Date | undefined) => void
  onTimeSelect: (time: string) => void
  onBarberSelect: (barber: Barber) => void
  onSubmit: () => void
}

export function BookingForm({
  service,
  barbers,
  formData,
  onDaySelect,
  onTimeSelect,
  onBarberSelect,
  onSubmit,
}: BookingFormProps) {
  const { selectedDay, selectedTime, selectedBarber } = formData

  const availableBarbers = useMemo(() => {
    if (!selectedDay || !selectedTime) return []

    const [hour, minute] = selectedTime.split(":").map(Number)
    const selectedDateTime = set(selectedDay, {
      hours: hour,
      minutes: minute,
      seconds: 0,
      milliseconds: 0,
    })

    return barbers.filter((barber) => {
      const isBooked = barber.bookings.some((booking) =>
        isEqual(new Date(booking.date), selectedDateTime),
      )
      return !isBooked
    })
  }, [barbers, selectedDay, selectedTime])

  const availableTimes = useMemo(() => {
    if (!selectedDay) return TIME_LIST

    const now = new Date()

    // Se o dia selecionado for hoje, filtra os horários que já passaram
    if (isSameDay(selectedDay, now)) {
      return TIME_LIST.filter((time) => {
        const [hour, minute] = time.split(":").map(Number)
        const timeToCheck = set(now, {
          hours: hour,
          minutes: minute,
          seconds: 0,
          milliseconds: 0,
        })
        return isAfter(timeToCheck, now)
      })
    }

    // Se for um dia futuro, retorna todos os horários
    return TIME_LIST
  }, [selectedDay])

  return (
    <>
      <div className="border-b border-solid py-5">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={selectedDay}
          onSelect={onDaySelect}
          fromDate={new Date()}
          className="rounded-lg"
          onDayClick={(date) => {
            onTimeSelect(undefined as any)
            onBarberSelect(undefined as any)
          }}
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

      {selectedDay && (
        <div className="flex gap-3 overflow-x-scroll border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
          {availableTimes.length > 0 ? (
            availableTimes.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className="w-full rounded-full border"
                onClick={() => {
                  onTimeSelect(time)
                  onBarberSelect(undefined as any)
                }}
              >
                {time}
              </Button>
            ))
          ) : (
            <p className="p-4 text-sm text-gray-500">
              Infelizmente não temos horários disponíveis para o dia
              selecionado.
            </p>
          )}
        </div>
      )}

      {selectedDay && selectedTime && (
        <div className="flex flex-col items-start justify-center border-b border-solid p-5">
          <h2 className="mb-2 text-sm font-bold">Selecione um profissional:</h2>
          <div className="flex w-full items-center justify-center">
            <Carousel className="w-[80%]">
              <CarouselContent>
                {!availableBarbers.length ? (
                  <p className="p-4 text-sm text-gray-500">
                    Nenhum profissional disponível para o horário selecionado
                  </p>
                ) : (
                  availableBarbers.map((barber) => (
                    <CarouselItem key={barber.id}>
                      <Toggle
                        pressed={selectedBarber?.id === barber.id}
                        onPressedChange={() => onBarberSelect(barber as any)}
                        className="flex w-full items-center gap-6 border p-6 transition hover:text-white"
                      >
                        <Image
                          src="https://github.com/shadcn.png"
                          alt={barber.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <p>{barber.name}</p>
                      </Toggle>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      )}

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
                <h2 className="text-sm text-muted-foreground">Data</h2>
                <p className="text-sm">
                  {format(selectedDay, "d 'de' MMMM", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm text-muted-foreground">Horário</h2>
                <p className="text-sm">{selectedTime}</p>
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm text-muted-foreground">Profissional</h2>
                <p className="text-sm">{selectedBarber?.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
