import { format } from "date-fns"
import { ptBR, se } from "date-fns/locale"
import { ClassValue } from "clsx"
import { cn } from "@/lib/utils"
import { Appointment, Service, Barber } from "@prisma/client"
import BarberCard from "./barber-card"
import AppointmentComponent from "./appointments-component"
import AnimatedBanner from "./banner-animated"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getUserData } from "@/app/_actions/get-user-data"

interface HomeSectionProps {
  className?: ClassValue
  confirmedAppointments: Appointment[]
  services: Service[]
  barbers: Barber[]
}

const HomeSection = async ({
  className,
  confirmedAppointments,
  services,
  barbers,
}: HomeSectionProps) => {
  const session = await auth.api.getSession({
    headers: headers(),
  })

  const user = session ? await getUserData(session.session) : null
  return (
    <div
      className={cn(
        "relative -mx-5 w-[calc(100%+40px)] lg:-mx-32 lg:w-[calc(100%+256px)] lg:px-32",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[url('/02.png')] bg-cover bg-center bg-no-repeat opacity-10" />
      <div className="relative grid grid-cols-2 gap-x-32 py-16 md:px-5">
        <div>
          <h2 className="text-xl font-semibold">
            <span className="font-normal">Olá,</span>{" "}
            {session?.user?.name?.split(" ")[0] || "faça login e agende"}!
          </h2>
          <span className="text-sm capitalize text-white">
            {format(new Date(), "EEEE, d", { locale: ptBR })}
          </span>
          <span className="text-sm text-white"> de </span>
          <span className="text-sm capitalize text-white">
            {format(new Date(), "MMMM", { locale: ptBR })}
          </span>
          <div>
            {session || confirmedAppointments.length >= 0 ? (
              <AppointmentComponent
                confirmedAppointments={confirmedAppointments}
                services={services}
                barbers={barbers}
              />
            ) : !user?.subscriptionID || !session ? (
              <AnimatedBanner />
            ) : (
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  Você ainda não tem agendamentos
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="h-full">
          <h2 className="mb-3 text-xs font-bold uppercase text-gray-500">
            Nossos Profissionais
          </h2>
          <div className="flex h-[calc(100%-24px)] gap-4 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
            {barbers.map((barber) => (
              <BarberCard
                key={barber.id}
                name={barber.name}
                image={barber.imageUrl || ""}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1"></div>
      </div>
    </div>
  )
}

export default HomeSection
