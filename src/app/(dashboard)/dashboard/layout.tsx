import { Inter } from "next/font/google"
import "@/app/globals.css"
import { Toaster } from "sonner"
import DashboardSidebar from "./_components/dashboard-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getUserData } from "@/app/_actions/get-user-data"

const inter = Inter({ subsets: ["latin"] })

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({
    headers: headers(),
  })
  const user = session ? await getUserData(session.session) : null

  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex`}>
        <SidebarProvider>
          <DashboardSidebar
            name={user?.name ?? ""}
            image={user?.image ?? ""}
            cargo={user?.employee?.cargo ?? ""}
          />
          <SidebarInset>
            <SidebarTrigger className="-ml-1" />

            {children}
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
