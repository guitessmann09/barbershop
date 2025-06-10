"use client"

import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react"
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./ui/sheet"
import quickSearchOptions from "@/app/_constants/search"
import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"
import { Dialog, DialogTrigger } from "./ui/dialog"
import LoginDialog from "./login-dialog"
import { useSession } from "next-auth/react"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import LogoutDialog from "./logout-dialog"

const SidebarSheet = () => {
  const { data } = useSession()

  return (
    <SheetContent className="overflow-y-auto px-5 py-3">
      <SheetHeader className="pb-6 text-start">
        <SheetTitle className="text-lg font-normal">Menu</SheetTitle>

        {data?.user ? (
          <SheetDescription className="flex items-center gap-3 pt-6">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={data?.user?.image ?? undefined} />
              <AvatarFallback>
                <UserIcon />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-bold text-foreground">
                {data?.user?.name}
              </p>
              <p className="text-xs text-foreground">{data?.user?.email}</p>
            </div>
          </SheetDescription>
        ) : (
          <SheetDescription className="flex items-center justify-between gap-3 pt-6">
            <h2 className="font-bold text-foreground">
              Faça login para continuar!
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon">
                  <LogInIcon size={18} />
                </Button>
              </DialogTrigger>
              <LoginDialog />
            </Dialog>
          </SheetDescription>
        )}
      </SheetHeader>
      {/* MENU */}
      <div className="flex flex-col gap-2 border-y-[1px] py-6">
        <SheetClose asChild>
          <Button
            variant="secondary"
            className="flex items-center justify-start gap-2"
            asChild
          >
            <Link href="/">
              <HomeIcon size={18} />
              <p className="text-sm font-normal">Ínicio</p>
            </Link>
          </Button>
        </SheetClose>
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-2"
        >
          <Link
            href="/bookings"
            className="flex w-full items-center justify-start gap-2"
          >
            <CalendarIcon size={18} />
            <p className="text-sm font-normal">Agendamentos</p>
          </Link>
        </Button>
      </div>
      {/* SERVIÇOS */}
      <div className="flex flex-col gap-2 py-6">
        {quickSearchOptions.map((option) => (
          <Button
            key={option.name}
            className="flex items-center justify-start gap-2"
            variant="ghost"
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
      {data?.user && (
        <div className="border-t">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="my-6 w-full justify-start">
                <LogOutIcon size={18} />
                <p>Sair da conta</p>
              </Button>
            </DialogTrigger>
            <LogoutDialog />
          </Dialog>
        </div>
      )}
    </SheetContent>
  )
}

export default SidebarSheet
