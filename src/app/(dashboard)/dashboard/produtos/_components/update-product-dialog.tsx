"use client"

import { ProductDto } from "@/app/_data-access/get-products"
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
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
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { NumericFormat } from "react-number-format"
import { toast } from "sonner"
import { Edit, Loader2Icon } from "lucide-react"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { updateProduct } from "@/app/_actions/product/update-product"

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Insira o nome do produto" }),
  price: z
    .number()
    .min(0.01, { message: "O valor é obrigatório" })
    .nonnegative(),
  stock: z.coerce
    .number({ message: "Insira um número válido" })
    .int()
    .min(0, { message: "O estoque não pode ser negativo" }),
  isActive: z.boolean(),
})

type FormSchema = z.infer<typeof formSchema>

interface UpdateProductDialogProps {
  product: ProductDto
}

const UpdateProductDialog = ({ product }: UpdateProductDialogProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const router = useRouter()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      price: Number(product.price),
      stock: product.quantityInStock,
      isActive: (product as unknown as { isActive?: boolean }).isActive ?? true,
    },
    values: {
      name: product.name,
      price: Number(product.price),
      stock: product.quantityInStock,
      isActive: (product as unknown as { isActive?: boolean }).isActive ?? true,
    },
  })

  const onSubmit = async (values: FormSchema) => {
    try {
      await updateProduct({
        id: product.id,
        name: values.name,
        price: values.price,
        stock: values.stock,
        isActive: values.isActive,
      })
      toast.success("Produto atualizado com sucesso")
      closeRef.current?.click()
      router.refresh()
    } catch (error) {
      toast.error("Erro ao atualizar produto")
    }
  }

  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger
        onClick={() => {
          setDialogIsOpen(true)
        }}
        className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-primary hover:text-secondary focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
      >
        <Edit size={16} /> Editar
      </DialogTrigger>

      <DialogContent
        onCloseAutoFocus={() =>
          form.reset({
            name: product.name,
            price: Number(product.price),
            stock: product.quantityInStock,
            isActive:
              (product as unknown as { isActive?: boolean }).isActive ?? true,
          })
        }
      >
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>Atualize as informações abaixo</DialogDescription>
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
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Situação do produto</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-checked={field.value}
                      />
                      <span className="text-sm text-muted-foreground">
                        {field.value ? "Ativo" : "Desativado"}
                      </span>
                    </div>
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2Icon className="animate-spin" />
                )}
                Salvar
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  ref={closeRef}
                  variant="outline"
                  onClick={() =>
                    form.reset({
                      name: product.name,
                      price: Number(product.price),
                      stock: product.quantityInStock,
                      isActive:
                        (product as unknown as { isActive?: boolean })
                          .isActive ?? true,
                    })
                  }
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

export default UpdateProductDialog
