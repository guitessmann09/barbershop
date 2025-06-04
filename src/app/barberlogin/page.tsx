import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HomeIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const BarberLogin = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4 rounded-full border border-secondary"
        asChild
      >
        <Link href="/">
          <HomeIcon />
        </Link>
      </Button>
      <Image src="/dandys-den.png" alt="Dendys Den" width={200} height={200} />
      <Card className="w-full max-w-[90%]">
        <CardHeader>
          <CardTitle>Olá, barbeiro!</CardTitle>
          <CardDescription>
            Insira suas credenciais para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default BarberLogin
