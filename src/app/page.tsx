import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { SearchIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import quickSearchOptions from "./_constants/search"
import BookingItem from "@/components/booking-item"

const Home = () => {
  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Guilherme</h2>
        <p className="text-sm text-gray-500">Segunda-feira, 2 de Junho</p>
        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Buscar" />
          <Button>
            <SearchIcon />
          </Button>
        </div>

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

        {/* BANNER */}
        <div className="relative h-[150px] w-full">
          <Image
            src="/dandys-den-banner-01.png"
            alt="Dandy's Den"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        {/* AGENDAMENTOS */}
        <BookingItem />
      </div>
    </div>
  )
}

export default Home
