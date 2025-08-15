"use client"

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
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select"
import { toast } from "sonner"
import { authClient } from "@/app/_providers/auth-client"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createUser } from "@/app/_actions/create-user"
import { useRouter } from "next/navigation"

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

const cargos = [
  { value: "admin", label: "Administrador" },
  { value: "caixa", label: "Caixa" },
  { value: "barbeiro", label: "Barbeiro" },
]

export default function SignUpUserForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
      router.refresh()
    }
    if (error) {
      console.error(error)
      toast.error(`Erro ao criar o usuário. ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </Form>
  )
}
