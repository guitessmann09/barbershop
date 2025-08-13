"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { PaymentMethod, Product } from "@prisma/client"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getFormattedCurrency } from "@/app/_helpers/format-currency"
import { getProductsAction } from "@/app/_actions/get-products"
import { createOrderAction } from "@/app/_actions/create-order"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type ClientOption = { id: string; name: string | null; email?: string }

const formSchema = z.object({
  userId: z.string().trim().min(1, "Selecione um cliente"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Produto obrigatório"),
        quantity: z.number().min(1, "Quantidade mínima é 1"),
      }),
    )
    .min(1, "Adicione pelo menos um item"),
  paymentMethod: z.nativeEnum(PaymentMethod).nullable(),
})

type FormData = z.infer<typeof formSchema>

const CreateOrderDialog = ({ clients }: { clients: ClientOption[] }) => {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      items: [],
      paymentMethod: null,
    },
  })

  useEffect(() => {
    ;(async () => {
      try {
        const prods = await getProductsAction()
        setProducts(prods)
      } catch {
        toast.error("Falha ao carregar produtos")
      }
    })()
  }, [])

  const items = form.watch("items")

  const subtotal = useMemo(() => {
    const priceMap = new Map(products.map((p) => [p.id, Number(p.price)]))
    return (items || []).reduce((sum, i) => {
      const unit = priceMap.get(i.productId) || 0
      return sum + unit * i.quantity
    }, 0)
  }, [items, products])

  function addProduct(productId: string) {
    const existing = items.find((i) => i.productId === productId)
    if (existing) {
      form.setValue(
        "items",
        items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
        ),
        { shouldValidate: true },
      )
    } else {
      form.setValue("items", [...items, { productId, quantity: 1 }], {
        shouldValidate: true,
      })
    }
  }

  function removeProduct(productId: string) {
    form.setValue(
      "items",
      items.filter((i) => i.productId !== productId),
      { shouldValidate: true },
    )
  }

  function updateQuantity(productId: string, quantity: number) {
    form.setValue(
      "items",
      items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      { shouldValidate: true },
    )
  }

  async function onSubmit(data: FormData) {
    try {
      await createOrderAction({
        userId: data.userId,
        items: data.items,
        paymentMethod: data.paymentMethod,
      })
      toast.success("Comanda criada com sucesso")
      closeRef.current?.click()
      router.refresh()
    } catch (e) {
      toast.error("Não foi possível criar a comanda")
    }
  }

  return (
    <DialogContent
      className="max-w-3xl"
      onCloseAutoFocus={() =>
        form.reset({ userId: "", items: [], paymentMethod: null })
      }
    >
      <DialogHeader>
        <DialogTitle>Criar comanda</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name || c.email || c.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-semibold">Produtos</p>
            <Select onValueChange={addProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Adicionar produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {getFormattedCurrency(Number(p.price))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum produto</p>
              ) : (
                items.map((it) => {
                  const prod = products.find((p) => p.id === it.productId)
                  const unit = prod ? Number(prod.price) : 0
                  return (
                    <div key={it.productId} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {prod?.name || it.productId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getFormattedCurrency(unit)}
                        </p>
                      </div>
                      <Input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            it.productId,
                            Math.max(1, Number(e.target.value)),
                          )
                        }
                        className="w-20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => removeProduct(it.productId)}
                      >
                        Remover
                      </Button>
                      <div className="w-24 text-right text-sm font-medium">
                        {getFormattedCurrency(unit * it.quantity)}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Subtotal</p>
              <p>{getFormattedCurrency(subtotal)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Forma de pagamento</p>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value || undefined}
                        onValueChange={(v) =>
                          field.onChange(v as PaymentMethod)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_sight">À vista</SelectItem>
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="credit_card">Crédito</SelectItem>
                          <SelectItem value="debit_card">Débito</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Total</p>
            <p className="text-lg font-bold">
              {getFormattedCurrency(subtotal)}
            </p>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar comanda
              </Button>
            </DialogClose>
            <div className="flex gap-2">
              <Button type="submit">Salvar comanda</Button>
            </div>
          </DialogFooter>

          {/* hidden close to programmatically close after submit */}
          <DialogClose asChild>
            <button
              type="button"
              ref={closeRef}
              aria-hidden
              className="hidden"
            />
          </DialogClose>
        </form>
      </Form>
    </DialogContent>
  )
}

export default CreateOrderDialog
