"use client"

import { addMinutes, format } from "date-fns"
import { AppointmentWithServicesAndUser } from "./calendar-appointment-card"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, StarIcon, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ptBR } from "date-fns/locale"
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
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Product, Service } from "@prisma/client"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import SelectAppointmentServiceDialog from "./select-appointment-service-dialog"
import { updateAppointment } from "@/app/_actions/update-appointment"
import { deleteAppointment } from "@/app/_actions/delete-appointments"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { isBarberAvailable } from "@/app/_actions/is-barber-available"
import { getOrderDetailsAction } from "@/app/_actions/get-order-details"
import { getProductsAction } from "@/app/_actions/get-products"
import { updateOrderAction } from "@/app/_actions/update-order"
import { getFormattedCurrency } from "@/app/_helpers/format-currency"

interface UpdateAppointmentFormProps {
  appointmentByBarber: AppointmentWithServicesAndUser
  onClose?: () => void
}

const formSchema = z.object({
  clientName: z.string().trim().min(1, "Nome do cliente é obrigatório"),
  barberName: z.string().trim().min(1, "Nome do profissional é obrigatório"),
  barberId: z.number().min(1, "Profissional é obrigatório"),
  services: z
    .array(
      z.object({
        service: z.custom<Service>(),
      }),
    )
    .min(1, "Pelo menos um serviço é obrigatório"),
  total: z.number().min(0),
})

type FormData = z.infer<typeof formSchema>

const UpdateAppointmentForm = ({
  appointmentByBarber,
  onClose,
}: UpdateAppointmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [orderItems, setOrderItems] = useState<
    Array<{ productId: string; name: string; price: number; quantity: number }>
  >([])
  const [initialOrderItems, setInitialOrderItems] = useState<
    Array<{ productId: string; name: string; price: number; quantity: number }>
  >([])
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: appointmentByBarber.user.name || "",
      barberName: appointmentByBarber.barberName,
      barberId: appointmentByBarber.barberId,
      services: appointmentByBarber.services,
      total: Number(appointmentByBarber.total),
    },
  })

  // Carrega produtos disponíveis e itens da comanda do agendamento
  useEffect(() => {
    ;(async () => {
      setIsLoadingProducts(true)
      try {
        const [order, prods] = await Promise.all([
          getOrderDetailsAction(appointmentByBarber.orderId),
          getProductsAction(),
        ])
        const mappedItems = (order.items || []).map((it) => ({
          productId: it.productId,
          name: it.product.name,
          price: Number(it.price),
          quantity: it.quantity,
        }))
        setOrderItems(mappedItems)
        setInitialOrderItems(mappedItems)
        setProducts(prods)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoadingProducts(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentByBarber.orderId])

  const addProduct = (productId: string) => {
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

  const removeProduct = (productId: string) => {
    setOrderItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setOrderItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    )
  }

  // Sincroniza o formulário quando o modo de edição muda
  useEffect(() => {
    if (!isEditing) {
      form.reset({
        clientName: appointmentByBarber.user.name || "",
        barberName: appointmentByBarber.barberName,
        barberId: appointmentByBarber.barberId,
        services: appointmentByBarber.services,
        total: Number(appointmentByBarber.total),
      })
    }
  }, [isEditing, appointmentByBarber, form])

  const handleServicesChange = (newServices: Service[]) => {
    const servicesWithServiceProperty = newServices.map((service) => ({
      service,
    }))
    form.setValue("services", servicesWithServiceProperty)
  }

  const handleRemoveService = (index: number) => {
    const currentServices = form.getValues("services")
    const updatedServices = currentServices.filter((_, i) => i !== index)
    form.setValue("services", updatedServices)
  }

  const onSubmit = async (data: FormData) => {
    if (data.services.length === 0) {
      toast.error("Adicione pelo menos um serviço")
      return
    }

    // Verifica se o barbeiro foi trocado
    const trocouBarbeiro = data.barberId !== appointmentByBarber.barberId
    if (trocouBarbeiro) {
      // Calcula duração total dos serviços
      const duracaoTotal = data.services.reduce(
        (sum, s) => sum + s.service.durationMinutes,
        0,
      )
      const disponivel = await isBarberAvailable({
        barberId: data.barberId,
        date: appointmentByBarber.date.toISOString(),
        duration: duracaoTotal,
        appointmentIdToIgnore: Number(appointmentByBarber.id),
      })
      if (!disponivel) {
        toast.error(
          "O profissional selecionado não está disponível neste horário.",
        )
        return
      }
    }

    setIsLoading(true)
    try {
      await updateAppointment({
        appointmentId: appointmentByBarber.id,
        services: data.services.map((s) => s.service),
        barberId: data.barberId,
      })

      // Atualiza itens da comanda associados ao agendamento
      await updateOrderAction({
        orderId: appointmentByBarber.orderId,
        items: orderItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
        paymentMethod: null,
        discountValue: 0,
      })

      toast.success("Agendamento atualizado com sucesso!")
      setIsEditing(false)
      router.refresh()
      onClose?.()
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error)
      toast.error("Erro ao atualizar agendamento")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    setOrderItems(initialOrderItems)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteAppointment({ id: String(appointmentByBarber.id) })
      toast.success("Agendamento deletado com sucesso!")
      router.refresh()
      onClose?.()
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error)
      toast.error("Erro ao deletar agendamento")
    } finally {
      setIsLoading(false)
    }
  }

  const currentServices = form.watch("services")

  return (
    <>
      <DialogHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <DialogTitle>Editar Agendamento</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            <span className="capitalize">
              {format(appointmentByBarber.date, "EEEE", { locale: ptBR })}
            </span>{" "}
            {format(appointmentByBarber.date, "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </DialogDescription>
        </div>
        <div className="flex items-center gap-2">
          {appointmentByBarber.user.subscriptionId && (
            <Badge variant="outline" className="flex items-center gap-1">
              <StarIcon className="h-3 w-3" />
              Assinante
            </Badge>
          )}
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="barberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profissional</FormLabel>
                <FormControl>
                  {isEditing ? (
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => {
                        const barberId = parseInt(value)
                        field.onChange(barberId)
                        const selectedBarber = appointmentByBarber.barbers.find(
                          (barber) => barber.id === barberId,
                        )
                        if (selectedBarber) {
                          form.setValue("barberName", selectedBarber.name)
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={appointmentByBarber.barberName}
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-muted">
                        {appointmentByBarber.barbers.map((barber) => (
                          <SelectItem key={barber.id} value={String(barber.id)}>
                            {barber.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input disabled value={form.getValues("barberName")} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="services"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Serviços</FormLabel>
                  {isEditing && (
                    <SelectAppointmentServiceDialog
                      allServices={appointmentByBarber.allServices}
                      prevSelectedServices={currentServices.map(
                        (s) => s.service,
                      )}
                      onServicesChange={handleServicesChange}
                    >
                      <Button variant="outline" size="sm" type="button">
                        <Plus className="h-4 w-4" />
                        {currentServices.length > 0
                          ? `${currentServices.length} serviço(s)`
                          : "Adicionar"}
                      </Button>
                    </SelectAppointmentServiceDialog>
                  )}
                </div>
                <FormControl>
                  <div className="space-y-2">
                    {currentServices.map((service, index) => (
                      <div key={index} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium">
                              {service.service.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Duração: {service.service.durationMinutes}min
                            </p>
                          </div>
                          {isEditing && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="hover:none text-destructive"
                              onClick={() => handleRemoveService(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {currentServices.length === 0 && (
                      <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
                        Nenhum serviço adicionado
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Produtos</Label>
            </div>
            <div className="space-y-2">
              {isEditing && (
                <Select onValueChange={addProduct}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingProducts
                          ? "Carregando produtos..."
                          : "Adicionar produto"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-muted">
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {getFormattedCurrency(Number(p.price))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="space-y-2">
                {orderItems.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
                    Nenhum produto adicionado
                  </div>
                ) : (
                  orderItems.map((it) => (
                    <div key={it.productId} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{it.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {getFormattedCurrency(it.price)}
                        </p>
                      </div>
                      {isEditing ? (
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
                      ) : (
                        <div className="w-20 text-center text-sm">
                          x{it.quantity}
                        </div>
                      )}
                      {isEditing && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="hover:none text-destructive"
                          onClick={() => removeProduct(it.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <div className="w-24 text-right text-sm font-medium">
                        {getFormattedCurrency(it.price * it.quantity)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <div className="rounded-lg border p-3">
              <Badge
                className={
                  appointmentByBarber.date < new Date()
                    ? `bg-primary`
                    : `bg-green-100 text-green-800 hover:bg-green-100`
                }
              >
                {appointmentByBarber.date < new Date()
                  ? "Concluído"
                  : "Confirmado"}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Horário</Label>
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {format(appointmentByBarber.date, "HH:mm", {
                      locale: ptBR,
                    })}{" "}
                    -{" "}
                    {format(
                      addMinutes(
                        appointmentByBarber.date,
                        currentServices.reduce(
                          (sum: number, s: { service: Service }) =>
                            sum + s.service.durationMinutes,
                          0,
                        ),
                      ),
                      "HH:mm",
                      { locale: ptBR },
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duração total:{" "}
                    {currentServices.reduce(
                      (sum: number, s: { service: Service }) =>
                        sum + s.service.durationMinutes,
                      0,
                    )}
                    min
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-6">
            <div className="flex flex-col gap-4">
              {isEditing && (
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              )}

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
                Deletar agendamento
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

export default UpdateAppointmentForm
