import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { CalendarIcon, HomeIcon, MenuIcon, SettingsIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./ui/sheet"
import quickSearchOptions from "@/app/_constants/search"

const Header = () => {
  return (
    <Card className="border-none bg-transparent">
      <CardContent className="flex items-center justify-between p-5">
        <Image src="/logo.png" alt="Dandy's Den" width={168} height={168} />
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="px-5 py-3">
            <SheetHeader className="pb-6 text-start">
              <SheetTitle className="text-lg font-normal">Menu</SheetTitle>
              <SheetDescription>Faça login para continuar</SheetDescription>
            </SheetHeader>
            {/* MENU */}
            <div className="flex flex-col gap-2 border-y-[1px] py-6">
              <Button
                variant="secondary"
                className="flex items-center justify-start gap-2"
              >
                <HomeIcon className="h-4 w-4" />
                <p className="text-sm font-normal">Ínicio</p>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2 border-none"
              >
                <CalendarIcon className="h-4 w-4" />
                <p className="text-sm font-normal">Agendamentos</p>
              </Button>
            </div>
            {/* SERVIÇOS */}
            <div className="flex flex-col gap-2 py-6">
              {quickSearchOptions.map((option) => (
                <Button
                  key={option.name}
                  className="flex items-center justify-start gap-2 border-none"
                  variant="outline"
                >
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
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
