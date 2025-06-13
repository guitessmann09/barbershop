"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
import { toast } from "sonner"

const BarberLogin = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard",
    })

    setLoading(false)

    if (res?.error) {
      toast.error("Credenciais inválidas")
      console.log(res.error)
    } else {
      router.push("/dashboard")
    }
  }

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
      <Card className="w-full max-w-[90%] sm:max-w-md">
        <CardHeader>
          <CardTitle>Olá, barbeiro!</CardTitle>
          <CardDescription>
            Insira suas credenciais para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default BarberLogin
