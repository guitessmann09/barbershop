"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { HomeIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { authClient, signIn } from "@/app/_providers/auth-client"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select"

const BarberLogin = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setLoading(true)

  //   const res = await signIn("credentials", {
  //     redirect: false,
  //     email,
  //     password,
  //     callbackUrl: "/dashboard",
  //   })

  //   setLoading(false)

  //   if (res?.error) {
  //     toast.error("Credenciais inválidas")
  //     console.log(res.error)
  //   } else {
  //     router.push("/dashboard")
  //   }
  // }

  const registerEmployeeFormSchema = z.object({
    email: z.string().email({ message: "Digite um email válido." }),
    name: z.string().trim().min(1, { message: "O nome é obrigatório." }),
    password: z
      .string()
      .trim()
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
  })

  const form = useForm<z.infer<typeof registerEmployeeFormSchema>>({
    resolver: zodResolver(registerEmployeeFormSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  })

  const onSubmit = async (
    values: z.infer<typeof registerEmployeeFormSchema>,
  ) => {
    const { data: newUser, error } = await authClient.admin.createUser({
      email: values.email,
      password: values.password,
      name: values.name,
      role: "user",
    })
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Entrando..." : "Login"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default BarberLogin
