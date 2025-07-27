"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HomeIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  Form,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import z, { string } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/app/_providers/auth-client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { toast, Toaster } from "sonner"
import { redirect } from "next/navigation"

const signInFormSchema = z.object({
  email: string().email({ message: "Digite um email válido." }),
  password: string().trim().min(1, { message: "A senha é obrigatória." }),
})

const BarberLogin = () => {
  const [isLoading, setIsLoading] = useState(false)

  const session = authClient.useSession()

  if (session.data?.user.id) {
    redirect("/dashboard")
  }

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
    setIsLoading(true)
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: false,
      callbackURL: "/dashboard",
    })
    if (data) {
      toast.success("Login realizado com sucesso!")
      console.log(data)
    }
    if (error) {
      toast.error(`Erro ao realizar o login. ${error.message}`)
      console.error(error)
    }
    setIsLoading(false)
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
      <Card className="w-full max-w-[90%] p-6 sm:max-w-md">
        <CardHeader className="mb-6 p-0">
          <CardTitle>Olá, barbeiro!</CardTitle>
          <CardDescription>
            Insira suas credenciais para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Entrando..." : "Login"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default BarberLogin
