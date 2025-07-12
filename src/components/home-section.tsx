import { format } from "date-fns"
import { ptBR, se } from "date-fns/locale"
import { Session } from "next-auth"
import { ClassValue } from "clsx"
import { cn } from "@/lib/utils"
import { Booking, Service, Barber } from "@prisma/client"
import BarberCard from "./barber-card"
import BookingComponent from "./bookings-component"
import AnimatedBanner from "./banner-animated"

interface TestProps {
  session: Session
  className?: ClassValue
  confirmedBookings: Booking[]
  services: Service[]
  barbers: Barber[]
}

const Test = ({
  session,
  className,
  confirmedBookings,
  services,
  barbers,
}: TestProps) => {
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
            {session ? (
              <BookingComponent
                session={session}
                confirmedBookings={confirmedBookings}
                services={services}
                barbers={barbers}
              />
            ) : (
              <AnimatedBanner />
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
                image={barber.imageURL || ""}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1"></div>
      </div>
    </div>
  )
}

export default Test
