"use client"

import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  Settings,
} from "lucide-react"
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./ui/sheet"
import Link from "next/link"
import { Button } from "./ui/button"
import { Dialog, DialogTrigger } from "./ui/dialog"
import LoginDialog from "./login-dialog"
import { useSession } from "next-auth/react"
import LogoutDialog from "./logout-dialog"
import Image from "next/image"
import { useState } from "react"

const SidebarSheet = () => {
  const { data } = useSession()
  const [loginDialogIsOpen, setLoginDialogIsOpen] = useState(false)

  return (
    <SheetContent className="overflow-y-auto px-5 py-3">
      <SheetHeader className="pb-6 text-start">
        <SheetTitle className="text-lg font-normal">Menu</SheetTitle>

        {data?.user ? (
          <SheetDescription className="flex items-center gap-3 pt-6">
            <div className="relative h-12 w-12">
              <Image
                src={data?.user?.image ?? ""}
                alt={data?.user?.name ?? ""}
                fill
                className="rounded-full border-2 border-primary object-cover"
              />
            </div>
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
                <Button size="icon" onClick={() => setLoginDialogIsOpen(true)}>
                  <LogInIcon size={18} />
                </Button>
              </DialogTrigger>
              <LoginDialog
                isOpen={loginDialogIsOpen}
                onOpenChange={setLoginDialogIsOpen}
              />
            </Dialog>
          </SheetDescription>
        )}
      </SheetHeader>
      {/* MENU */}
      <div className="flex flex-col gap-2 border-y-[1px] py-6">
        <SheetClose asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-2"
            asChild
          >
            <Link href="/">
              <HomeIcon size={18} />
              <p className="text-sm font-normal">Ínicio</p>
            </Link>
          </Button>
        </SheetClose>
        {data?.user && (
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-2"
          >
            <Link
              href={
                data?.user?.provider === "credentials"
                  ? "/dashboard"
                  : "/bookings"
              }
              className="flex w-full items-center justify-start gap-2"
            >
              <CalendarIcon size={18} />
              <p className="text-sm font-normal">Agendamentos</p>
            </Link>
          </Button>
        )}
        {data?.user?.provider === "credentials" && (
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start gap-2"
            asChild
          >
            <Link href="/settings">
              <Settings size={18} />
              <p className="text-sm">Configurações</p>
            </Link>
          </Button>
        )}
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
