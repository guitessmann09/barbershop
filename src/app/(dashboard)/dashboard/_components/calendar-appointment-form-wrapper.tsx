"use client"
import { useRouter } from "next/navigation"
import CalendarAppointmentForm from "./calendar-appointment-form"
import type { CalendarAppointmentFormProps } from "./calendar-appointment-form"

export default function CalendarAppointmentFormWrapper(
  props: CalendarAppointmentFormProps,
) {
  const router = useRouter()
  return (
    <CalendarAppointmentForm
      {...props}
      onAppointmentCreated={() => router.refresh()}
    />
  )
}
