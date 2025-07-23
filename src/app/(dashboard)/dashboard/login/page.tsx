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
import { createUser } from "@/app/_actions/create-user"

const BarberLogin = () => {
  const [loading, setLoading] = useState(false)

  const registerEmployeeFormSchema = z.object({
    email: z.string().email({ message: "Digite um email válido." }),
    name: z.string().trim().min(1, { message: "O nome é obrigatório." }),
    password: z
      .string()
      .trim()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
      .max(128),
    cargo: z.enum(["admin", "caixa", "barbeiro"], {
      message: "Selecione um cargo válido.",
    }),
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
    setLoading(true)
    const { data, error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    })
    if (data) {
      await createUser({
        data: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          password: values.password,
          cargo: values.cargo,
        },
      })
      toast.success("Usuário cadastrado com sucesso")
      form.reset()
    }
    if (error) {
      console.error(error)
      toast.error(`Erro ao criar o usuário. ${error.message}`)
    }
    setLoading(false)
  }
  const cargos = [
    { value: "admin", label: "Administrador" },
    { value: "caixa", label: "Caixa" },
    { value: "barbeiro", label: "Barbeiro" },
  ]
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
                    <Input {...field} />
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
            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-muted">
                      {cargos.map((cargo) => (
                        <SelectItem key={cargo.value} value={cargo.value}>
                          {cargo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
