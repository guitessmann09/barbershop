import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { MenuIcon } from "lucide-react"

const Header = () => {
  return (
    <Card className="border-none bg-transparent">
      <CardContent className="flex items-center justify-between p-5">
        <Image src="/logo.png" alt="Dandy's Den" width={168} height={168} />
        <Button size="icon" variant="outline">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default Header
