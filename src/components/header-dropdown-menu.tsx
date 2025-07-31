"use client"

import Image from "next/image"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import Link from "next/link"
import { Calendar, HomeIcon, LogOut } from "lucide-react"
import LogoutDialog from "./logout-dialog"
import { useState } from "react"
import { UserData } from "@/app/_actions/get-user-data"

const HeaderDropDownMenu = (user: UserData) => {
  const [logOutDialogIsOpen, setLogOutDialogIsOpen] = useState(false)

  return (
    <div className="flex items-center gap-4 font-semibold">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full items-center gap-2 px-4 py-2 hover:bg-transparent hover:text-primary"
          >
            <p className="max-w-[100px] truncate text-sm">{user?.name}</p>
            <div className="relative h-10 w-10">
              <Image
                src={user?.image || "/default-avatar.png"}
                alt={user?.name || "Usuário"}
                fill
                className="rounded-full object-cover"
              />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-muted">
          <DropdownMenuItem className="cursor-pointer hover:bg-transparent hover:text-primary">
            <Link href="/" className="flex w-full items-center gap-2">
              <HomeIcon size={18} />
              <p className="text-sm">Início</p>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-transparent hover:text-primary">
            <Link
              href="/appointments"
              className="flex w-full items-center gap-2"
            >
              <Calendar size={18} />
              <p className="text-sm">Agendamentos</p>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-transparent hover:text-primary"
            onClick={() => {
              setLogOutDialogIsOpen(true)
            }}
          >
            <LogOut size={18} />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutDialog
        isOpen={logOutDialogIsOpen}
        onOpenChange={setLogOutDialogIsOpen}
      />
    </div>
  )
}

export default HeaderDropDownMenu
