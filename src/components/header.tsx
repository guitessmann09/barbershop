import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Link from "next/link"
const Header = () => {
  return (
    <Card className="border-none bg-transparent">
      <CardContent className="flex items-center justify-between p-5">
        <Link href="/" className="cursor-pointer">
          <Image src="/logo.png" alt="Dandy's Den" width={130} height={130} />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuIcon size={18} />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
