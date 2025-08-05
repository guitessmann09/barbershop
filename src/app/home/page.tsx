import Header from "@/components/header"
import ServiceItem from "@/components/service-item"
import { getData } from "@/lib/queries"
import { getConfirmedAppointments } from "@/app/_constants/get-appointments"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import AnimatedBanner from "@/components/banner-animated"
import { getUserData } from "../_actions/get-user-data"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import HomeSection from "@/components/home-section"
import AppointmentItem from "@/components/appointment-item"

const Home = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  })

  const user = session?.session ? await getUserData(session.session) : undefined
  const { services, barbers, appointments } = await getData()

  const confirmedAppointments = await getConfirmedAppointments(appointments)

  return (
    <div>
      <Header />
      <div className="p-5 md:px-5 md:pt-0 lg:px-32">
        <HomeSection
          className="hidden md:block"
          confirmedAppointments={confirmedAppointments}
          services={services}
          barbers={barbers}
        />
        <div className="md:hidden">
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
        </div>
        {/* BANNER */}
        <div className="md:hidden">
          <AnimatedBanner />
        </div>
        {/* AGENDAMENTOS */}
        <div className="md:hidden">
          <h2 className="mt-6 text-xs font-bold uppercase text-gray-500">
            Agendamentos
          </h2>
          {!session || !confirmedAppointments.length ? (
            <div className="mt-3">
              <p className="text-sm text-gray-500">
                Você ainda não tem agendamentos
              </p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
              {confirmedAppointments
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
                )
                .map((appointment) => (
                  <AppointmentItem
                    key={appointment.id}
                    appointment={appointment}
                    services={services}
                    barbers={barbers}
                  />
                ))}
            </div>
          )}
        </div>

        {/* SERVICOS */}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
          Serviços
        </h2>
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceItem key={service.id} service={service} barbers={barbers} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
