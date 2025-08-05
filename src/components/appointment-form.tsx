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
import { AppointmentFormData, BarberWithAppointments } from "@/types/barbershop"
import { Service, Barber } from "@prisma/client"
import { useMemo, useEffect, useState } from "react"
import {
  calculateServiceDiscount,
  calculateFinalPrice,
} from "@/app/_helpers/get-discount"
import { getUserData, UserData } from "@/app/_actions/get-user-data"
import { calculateDiscountAction } from "@/app/_actions/calculate-discount"
import {
  getAvailableTimes,
  AvailableTime,
} from "@/app/_actions/get-available-times"
import { useSession } from "@/app/_providers/auth-client"

interface AppointmentFormProps {
  service: Service
  barbers: BarberWithAppointments[]
  formData: AppointmentFormData
  onDaySelect: (date: Date | undefined) => void
  onTimeSelect: (time: string) => void
  onBarberSelect: (barber: Barber) => void
}

export function AppointmentForm({
  service,
  barbers,
  formData,
  onDaySelect,
  onTimeSelect,
  onBarberSelect,
}: AppointmentFormProps) {
  const { selectedDay, selectedTime, selectedBarber } = formData
  const [userData, setUserData] = useState<UserData | null>(null)
  const [discountInfo, setDiscountInfo] = useState<{
    discountPercentage: number
    isFree: boolean
    reason: string
  } | null>(null)
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([])

  const session = useSession()

  // Buscar dados do usuário quando a sessão estiver disponível
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.data?.session) {
        try {
          const data = await getUserData(session.data.session)
          setUserData(data ?? null)
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error)
        }
      }
    }

    fetchUserData()
  }, [session?.data?.session])

  // Calcular desconto quando o usuário e data são selecionados
  useEffect(() => {
    const calculateDiscount = async () => {
      if (!userData || !selectedDay) {
        setDiscountInfo(null)
        return
      }

      try {
        const discount = await calculateDiscountAction(
          service,
          userData,
          selectedDay,
        )
        setDiscountInfo(discount)
      } catch (error) {
        console.error("Erro ao calcular desconto:", error)
        setDiscountInfo(null)
      }
    }

    calculateDiscount()
  }, [userData, selectedDay, service])

  // Buscar horários disponíveis quando a data é selecionada
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!selectedDay) {
        setAvailableTimes([])
        return
      }

      try {
        const times = await getAvailableTimes(
          selectedDay,
          service.durationMinutes,
        )
        setAvailableTimes(times)
      } catch (error) {
        console.error("Erro ao buscar horários disponíveis:", error)
        setAvailableTimes([])
      }
    }

    fetchAvailableTimes()
  }, [selectedDay, service.durationMinutes])

  const availableBarbers = useMemo(() => {
    if (!selectedDay || !selectedTime) return []

    // Encontrar o horário selecionado nos horários disponíveis
    const selectedTimeSlot = availableTimes.find(
      (timeSlot) => timeSlot.time === selectedTime,
    )

    if (!selectedTimeSlot) return []

    // Filtrar barbeiros que estão disponíveis neste horário
    return barbers.filter((barber) =>
      selectedTimeSlot.availableBarbers.includes(barber.id),
    )
  }, [barbers, selectedDay, selectedTime, availableTimes])

  console.log(availableTimes)

  const originalPrice = Number(service.price)
  const finalPrice = discountInfo
    ? calculateFinalPrice(originalPrice, discountInfo)
    : originalPrice

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
          onDayClick={() => {
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
            availableTimes.map((timeSlot) => (
              <Button
                key={timeSlot.time}
                variant={selectedTime === timeSlot.time ? "default" : "outline"}
                className="w-full rounded-full border"
                onClick={() => {
                  onTimeSelect(timeSlot.time)
                  onBarberSelect(undefined as any)
                }}
              >
                {timeSlot.time}
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
                        className="flex w-full items-center gap-3 border p-6 transition hover:text-white"
                      >
                        <div className="relative h-10 w-10">
                          <Image
                            src={barber?.imageUrl || ""}
                            alt={barber.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-semibold">{barber.name}</p>
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
                <div className="flex flex-col items-end">
                  {discountInfo && discountInfo.discountPercentage > 0 && (
                    <p className="text-xs text-muted-foreground line-through">
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(originalPrice)}
                    </p>
                  )}
                  <p className="text-sm font-bold">
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(finalPrice)}
                  </p>
                </div>
              </div>

              {discountInfo && discountInfo.discountPercentage > 0 && (
                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-muted-foreground">Desconto</h2>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-bold text-green-600">
                      -{discountInfo.discountPercentage}%
                    </p>
                  </div>
                </div>
              )}

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
