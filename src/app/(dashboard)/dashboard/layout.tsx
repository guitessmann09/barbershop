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
import BreadcrumbDashboard from "./_components/breadcrumb-dashboard"
import { Separator } from "@/components/ui/separator"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"

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

  const getCredential = await db.account.findFirst({
    where: {
      userId: session?.user.id,
    },
    select: {
      providerId: true,
    },
  })
  if (getCredential?.providerId != "credential" || !session?.user.id) {
    redirect("/home")
  }

  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex`}>
        <SidebarProvider>
          <DashboardSidebar
            name={user?.name ?? ""}
            image={user?.image ?? ""}
            cargo={user?.employee?.cargo ?? ""}
          />
          <SidebarInset className="p-4">
            <div className="mb-4 flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BreadcrumbDashboard />
            </div>
            {children}
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
