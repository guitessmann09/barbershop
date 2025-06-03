import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { SearchIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

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
        <div className="relative mt-6 h-[150px] w-full">
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
        <Card className="mt-3 border-border bg-muted">
          <CardContent className="flex justify-between p-0">
            {/* ESQUERDA */}
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge className="w-fit">Confirmado</Badge>
              <h3 className="font-semibold">Corte de cabelo</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
                <p className="text-sm">Junior</p>
              </div>
            </div>

            {/* DIREITA */}
            <div className="flex flex-col items-center justify-center border-l-2 border-solid border-border px-5">
              <p className="text-sm">Junho</p>
              <p className="text-2xl">06</p>
              <p className="text-sm">17:00</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home
