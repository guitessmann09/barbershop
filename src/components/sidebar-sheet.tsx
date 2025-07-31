"use client"

import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOut,
  StarIcon,
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
import LogoutDialog from "./logout-dialog"
import Image from "next/image"
import { useState } from "react"
import { useSession } from "@/app/_providers/auth-client"

const SidebarSheet = () => {
  const [loginDialogIsOpen, setLoginDialogIsOpen] = useState(false)
  const [logOutDialogIsOpen, setLogOutDialogIsOpen] = useState(false)
  const session = useSession()
  const user = session.data?.user
  return (
    <SheetContent className="overflow-y-auto px-5 py-3">
      <SheetHeader className="pb-6 text-start">
        <SheetTitle className="text-lg font-normal">Menu</SheetTitle>

        {user ? (
          <SheetDescription className="flex items-center gap-3 pt-6">
            <div className="relative h-12 w-12">
              <Image
                src={user?.image ?? ""}
                alt={user?.name ?? ""}
                fill
                className="rounded-full border-2 border-primary object-cover"
              />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-foreground">{user?.email}</p>
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
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-2"
          asChild
        >
          <Link href="/subscriptions">
            <StarIcon size={18} />
            <p className="text-sm font-normal">Assinaturas</p>
          </Link>
        </Button>
        {user && (
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-2"
          >
            <Link
              href={"/appointments"}
              className="flex w-full items-center justify-start gap-2"
            >
              <CalendarIcon size={18} />
              <p className="text-sm font-normal">Agendamentos</p>
            </Link>
          </Button>
        )}
      </div>
      {user && (
        <div className="border-t pt-6">
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start gap-2"
            onClick={() => {
              setLogOutDialogIsOpen(true)
            }}
          >
            <LogOut size={18} />
            <span>Sair</span>
          </Button>
          <LogoutDialog
            isOpen={logOutDialogIsOpen}
            onOpenChange={setLogOutDialogIsOpen}
          />
        </div>
      )}
    </SheetContent>
  )
}

export default SidebarSheet
