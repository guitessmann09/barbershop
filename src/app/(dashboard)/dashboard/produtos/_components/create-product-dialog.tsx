"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { NumericFormat } from "react-number-format"
import { createProduct } from "@/app/_actions/product/create-product"
import { toast } from "sonner"
import { Loader2Icon, PlusIcon } from "lucide-react"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Insira o nome do produto" }),
  price: z
    .number()
    .min(0.01, { message: "O valor é obrigatório" })
    .nonnegative(),
  stock: z.coerce
    .number({ message: "Insira um número válido" })
    .int()
    .min(1, { message: "O estoque não pode iniciar zerado ou ser negativo" }),
})

type FormSchema = z.infer<typeof formSchema>

const CreateProductDialog = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const router = useRouter()
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
    },
  })
  const onSubmit = async (values: FormSchema) => {
    try {
      await createProduct(values)
      toast.success("Produto criado com sucesso")
      closeRef.current?.click()
      router.refresh()
    } catch (error) {
      toast.error(`Erro ao criar produto`)
    }
  }
  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2"
          onClick={() => {
            setDialogIsOpen(true)
          }}
        >
          <PlusIcon size={20} />
          Novo produto
        </Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={() => form.reset({ name: "", price: 0, stock: 0 })}
      >
        <DialogHeader>
          <DialogTitle>Cadastrar Produto</DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor unitário</FormLabel>
                  <FormControl>
                    <NumericFormat
                      thousandSeparator="."
                      decimalSeparator=","
                      fixedDecimalScale
                      decimalScale={2}
                      prefix="R$ "
                      allowNegative={false}
                      customInput={Input}
                      onValueChange={(values) =>
                        field.onChange(values.floatValue)
                      }
                      {...field}
                      onChange={() => {}}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estoque</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex gap-2">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                onClick={() => {
                  setDialogIsOpen(false)
                }}
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="animate-spin" />
                )}
                Criar Produto
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset({ name: "", price: 0, stock: 0 })
                  }}
                >
                  Cancelar
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateProductDialog
