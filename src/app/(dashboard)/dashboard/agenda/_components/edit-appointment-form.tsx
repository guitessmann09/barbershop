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
import { Service } from "@prisma/client"
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

interface EditAppointmentProps {
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

const EditAppointmentForm = ({
  appointmentByBarber,
  onClose,
}: EditAppointmentProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
              <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
                Nenhum produto adicionado
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

export default EditAppointmentForm
