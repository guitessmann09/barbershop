import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import quickSearchOptions from "./_constants/search"
import BookingItem from "@/components/booking-item"
import ServiceItem from "@/components/service-item"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { getData } from "@/lib/queries"
import { getConfirmedBookings } from "@/app/_constants/get-bookings"
const Home = async () => {
  const session = await getServerSession(authOptions)
  const { services, barbers, bookings, availableDays } = await getData()

  const confirmedBookings = await getConfirmedBookings(bookings)

  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">
          Olá, {session?.user?.name?.split(" ")[0] || "faça login e agende!"}
        </h2>
        <p className="text-sm capitalize text-gray-500">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>

        {/* BANNER */}
        <div className="relative mt-5 h-[150px] w-full">
          <Image
            src="/dandys-den-banner-01.png"
            alt="Dandy's Den"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        {/* AGENDAMENTOS */}
        <h2 className="mt-6 text-xs font-bold uppercase text-gray-500">
          Agendamentos
        </h2>
        {!session || !confirmedBookings.length ? (
          <div className="mt-3">
            <p className="text-sm text-gray-500">
              Você ainda não tem agendamentos
            </p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
            {confirmedBookings
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              )
              .map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={booking}
                  services={services}
                  barbers={barbers}
                />
              ))}
          </div>
        )}
        {/* QUICK SEARCH */}
        <div className="my-6 flex items-center gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button key={option.name} className="gap-2" variant="secondary">
              <Image
                src={option.imageURL}
                alt={option.name}
                width={16}
                height={16}
              />
              <p>{option.name}</p>
            </Button>
          ))}
        </div>

        {/* SERVICOS */}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
          Serviços
        </h2>
        <div className="space-y-3">
          {services.map((service) => (
            <ServiceItem
              key={service.id}
              service={service}
              barbers={barbers}
              availableDays={availableDays}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
