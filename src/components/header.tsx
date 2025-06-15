import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { MenuIcon, UserIcon } from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Link from "next/link"
const Header = () => {
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
          <Button size="icon" variant="outline">
            <UserIcon size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Header
