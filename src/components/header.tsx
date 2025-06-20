"use client"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import {
  Calendar,
  LogIn,
  LogOut,
  MenuIcon,
  Settings,
  HomeIcon,
} from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Link from "next/link"
import { signOut } from "next-auth/react"
import LoginDialog from "./login-dialog"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface User {
  name: string
  email: string
  image: string
  provider: string
}

const Header = ({ user }: { user: User }) => {
  const [loginDialogIsOpen, setLoginDialogIsOpen] = useState(false)
  return (
    <Card className="border-none bg-transparent">
      <CardContent className="flex items-center justify-between p-5 lg:px-32">
        <Link href="/" className="cursor-pointer">
          <Image src="/logo.png" alt="Dandy's Den" width={130} height={130} />
        </Link>
        <Sheet>
          <SheetTrigger className="lg:hidden" asChild>
            <Button size="icon" variant="outline">
              <MenuIcon size={18} />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
        <div className="hidden lg:block">
          {user ? (
            <div className="flex items-center gap-4 font-semibold">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex w-full items-center gap-2 px-4 py-2 hover:bg-transparent hover:text-primary"
                  >
                    <div className="relative h-10 w-10">
                      <Image
                        src={user.image}
                        alt={user.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <p className="max-w-[100px] truncate text-sm">
                      {user.name}
                    </p>
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
                      href={
                        user.provider === "credentials"
                          ? "/dashboard"
                          : "/bookings"
                      }
                      className="flex w-full items-center gap-2"
                    >
                      <Calendar size={18} />
                      <p className="text-sm">Agendamentos</p>
                    </Link>
                  </DropdownMenuItem>
                  {user.provider === "credentials" && (
                    <DropdownMenuItem className="cursor-pointer hover:bg-transparent hover:text-primary">
                      <Link
                        href="/settings"
                        className="flex w-full items-center gap-2"
                      >
                        <Settings size={18} />
                        <p className="text-sm">Configurações</p>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-transparent hover:text-primary"
                    onClick={() => {
                      signOut()
                    }}
                  >
                    <LogOut size={18} />
                    <p className="text-sm">Sair da conta</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  setLoginDialogIsOpen(true)
                }}
              >
                <LogIn size={18} />
                <span className="text-sm font-bold">Login</span>
              </Button>
              <LoginDialog
                isOpen={loginDialogIsOpen}
                onOpenChange={setLoginDialogIsOpen}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default Header
