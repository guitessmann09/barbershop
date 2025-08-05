import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { MenuIcon, StarIcon } from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Link from "next/link"
import HeaderDropDownMenu from "./header-dropdown-menu"
import LoginButton from "./header-login-button"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getUserData } from "@/app/_actions/get-user-data"

const Header = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  })

  const user = session?.session ? await getUserData(session.session) : undefined
  return (
    <Card className="border-none bg-transparent">
      <CardContent className="flex items-center justify-between p-5 lg:px-32">
        <Link href="/home" className="cursor-pointer">
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
        <div className="hidden lg:flex lg:gap-4">
          <Button
            asChild
            variant="ghost"
            className="flex items-center gap-2 px-4 py-2 hover:bg-transparent hover:text-primary"
          >
            <Link href="/subscriptions">
              <StarIcon />
              <span>Assinaturas</span>
            </Link>
          </Button>
          {user ? <HeaderDropDownMenu {...user} /> : <LoginButton />}
        </div>
      </CardContent>
    </Card>
  )
}

export default Header
