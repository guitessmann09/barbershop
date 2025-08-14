"use client"

import { getOrderDetailsAction } from "@/app/_actions/get-order-details"
import { updateOrderAction } from "@/app/_actions/update-order"
import { closeOrderAction } from "@/app/_actions/close-order"
import { getProductsAction } from "@/app/_actions/get-products"
import { getFormattedCurrency } from "@/app/_helpers/format-currency"
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEffect, useMemo, useState } from "react"
import { Product, PaymentMethod } from "@prisma/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { deleteOrderAction } from "@/app/_actions/delete-order"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2Icon } from "lucide-react"
import { NumericFormat } from "react-number-format"

const UpdateOrderDialog = ({
  isOpen,
  onOpenChange,
  orderId,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  orderId: number
}) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [customer, setCustomer] = useState<
    { id: string; name: string | null; email: string } | undefined
  >()
  const [services, setServices] = useState<
    { id: string; name: string; price: number }[]
  >([])
  const [orderItems, setOrderItems] = useState<
    Array<{ productId: string; name: string; price: number; quantity: number }>
  >([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [discount, setDiscount] = useState<number>(0)

  useEffect(() => {
    if (!isOpen) return
    ;(async () => {
      setLoading(true)
      try {
        const [order, prods] = await Promise.all([
          getOrderDetailsAction(orderId),
          getProductsAction(),
        ])

        setCustomer(order.user)
        setServices(
          (order.appointment?.services || []).map((s) => ({
            id: s.service.id,
            name: s.service.name,
            price: Number(s.service.price),
          })),
        )
        setOrderItems(
          (order.items || []).map((it) => ({
            productId: it.productId,
            name: it.product.name,
            price: Number(it.price),
            quantity: it.quantity,
          })),
        )
        setPaymentMethod(order.paymentMethod)
        setProducts(prods)
        setDiscount(0)
      } finally {
        setLoading(false)
      }
    })()
  }, [isOpen, orderId])

  const servicesTotal = useMemo(
    () => services.reduce((sum, s) => sum + s.price, 0),
    [services],
  )
  const productsTotal = useMemo(
    () => orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [orderItems],
  )
  const subtotal = servicesTotal + productsTotal
  const total = Math.max(0, subtotal - discount)

  function addProduct(productId: string) {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.productId === productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
        },
      ]
    })
  }

  function removeProduct(productId: string) {
    setOrderItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  function updateQuantity(productId: string, quantity: number) {
    setOrderItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    )
  }

  async function handleSave() {
    setLoading(true)
    try {
      await updateOrderAction({
        orderId,
        items: orderItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
        paymentMethod,
        discountValue: discount,
      })
      onOpenChange(false)
      toast.success("Comanda atualizada")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function handleCloseOrder() {
    if (!paymentMethod) {
      toast.error("Selecione o método de pagamento para fechar a comanda")
      return
    }
    setLoading(true)
    try {
      await closeOrderAction({
        orderId,
        items: orderItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
        paymentMethod: paymentMethod!,
        discountValue: discount,
      })
      onOpenChange(false)
      toast.success("Comanda fechada com sucesso")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteOrderAction(orderId)
      onOpenChange(false)
      toast.success("Comanda deletada")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar comanda</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Cliente</p>
            <p className="text-base font-medium">
              {customer?.name || customer?.email || customer?.id || "—"}
            </p>
          </div>

          <Separator />

          <div>
            <p className="mb-2 text-sm font-semibold">Serviços realizados</p>
            <div className="space-y-1">
              {services.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum serviço</p>
              ) : (
                services.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{s.name}</span>
                    <span>{getFormattedCurrency(s.price)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-semibold">Produtos</p>
            <div className="flex gap-2">
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
            </div>

            <div className="space-y-2">
              {orderItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum produto</p>
              ) : (
                orderItems.map((it) => (
                  <div key={it.productId} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{it.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getFormattedCurrency(it.price)}
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
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removeProduct(it.productId)}
                    >
                      <Trash2Icon size={16} />
                    </Button>
                    <div className="w-24 text-right text-sm font-medium">
                      {getFormattedCurrency(it.price * it.quantity)}
                    </div>
                  </div>
                ))
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
              <p className="text-sm font-semibold">Desconto (R$)</p>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                fixedDecimalScale
                decimalScale={2}
                prefix="R$ "
                allowNegative={false}
                customInput={Input}
                onValueChange={(e) => setDiscount(Math.max(0, Number(e.value)))}
                onChange={() => {}}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Método de pagamento</p>
              <Select
                value={paymentMethod || undefined}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
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
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Total</p>
            <p className="text-lg font-bold">{getFormattedCurrency(total)}</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Deletar comanda
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar edição
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              Salvar alterações
            </Button>
            <Button
              onClick={handleCloseOrder}
              disabled={loading || !paymentMethod}
            >
              Fechar comanda
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateOrderDialog
