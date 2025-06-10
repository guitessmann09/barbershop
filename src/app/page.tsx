import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import quickSearchOptions from "./_constants/search"
import BookingItem from "@/components/booking-item"
import { db } from "@/lib/prisma"
import ServiceItem from "@/components/service-item"

const Home = async () => {
  const services = await db.service.findMany({})
  const barbers = await db.barber.findMany({
    select: {
      id: true,
      name: true,
      bookings: {
        select: { date: true },
      },
      imageURL: true,
    },
  })
  const bookings = await db.booking.findMany({})

  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Guilherme</h2>
        <p className="text-sm text-gray-500">Segunda-feira, 2 de Junho</p>

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
        <BookingItem
          booking={bookings[0]}
          services={services}
          barbers={barbers}
        />

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
            <ServiceItem key={service.id} service={service} barbers={barbers} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
