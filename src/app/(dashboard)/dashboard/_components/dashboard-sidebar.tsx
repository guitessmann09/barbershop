"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ChevronDown, LogOut, Settings, UserIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import SidebarAppMenuItem from "./sidebar-app-menu-item"
import { useRouter } from "next/navigation"
import sidebarItems from "@/app/_constants/sidebar-items"
import { authClient } from "@/app/_providers/auth-client"
import LogoutDialog from "@/components/logout-dialog"
import { useState } from "react"

interface UserProps {
  name: string
  image: string
  cargo: string
}

const DashboardSidebar = (user: UserProps) => {
  const [logOutDialogIsOpen, setLogOutDialogIsOpen] = useState(false)
  const router = useRouter()
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-fit">
              <Link href="/dashboard" className="flex gap-6">
                <div className="relative h-12 w-12">
                  <Image
                    src="/dandys-den.png"
                    alt="Dandys Den Logo"
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Dandy&apos;s Den
                  </span>
                  <span className="truncate text-xs">Gerenciamento</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarAppMenuItem
              section={sidebarItems.quickSideBarMainMenuItem}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Estoque */}
        <SidebarGroup>
          <SidebarGroupLabel>Estoque</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarAppMenuItem
              section={sidebarItems.quickSideBarStockMenuItem}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Funcionários */}
        <SidebarGroup>
          <SidebarGroupLabel>Funcionários</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarAppMenuItem
              section={sidebarItems.quickSideBarEmployeeMenuItem}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.image ?? undefined}
                      alt={user?.name ?? ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs capitalize">
                      {user?.cargo}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <UserIcon />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setLogOutDialogIsOpen(true)
                  }}
                >
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          <LogoutDialog
            isOpen={logOutDialogIsOpen}
            onOpenChange={setLogOutDialogIsOpen}
          />
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default DashboardSidebar
