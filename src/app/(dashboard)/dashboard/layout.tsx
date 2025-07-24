import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { Toaster } from "sonner"
import DashboardSidebar from "./_components/dashboard-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
