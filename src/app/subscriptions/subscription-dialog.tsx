"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, CreditCard, User, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface SubscriptionInfoProps {
  userId?: string
}

interface SubscriptionData {
  subscription: {
    id: number
    name: string
    price: number
    benefits: Array<{
      id: number
      description: string
    }>
    stripePrice: string | null
    stripeSubscription?: any
    stripeCustomer?: any
    createdAt?: string
    nextBillingDate?: string
    currentPeriodStart?: string
    currentPeriodEnd?: string
  } | null
  message?: string
}

const SubscriptionDialog = ({ userId }: SubscriptionInfoProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/subscription")

        if (!response.ok) {
          throw new Error("Erro ao buscar assinatura")
        }

        const data = await response.json()
        setSubscriptionData(data)
      } catch (err) {
        throw new Error()
      }
    }
    if (userId) {
      fetchSubscription()
    }
  }, [userId])

  const handleCancelSubscription = async () => {
    setIsCancelling(true)

    // Simular chamada da API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsCancelling(false)
    setIsOpen(false)

    // Aqui você implementaria a lógica real de cancelamento
    alert("Assinatura cancelada com sucesso!")
  }

  console.log({ subscriptionData })

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="lg">
            Gerenciar Assinatura
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Gerenciar Assinatura
            </AlertDialogTitle>
            <AlertDialogDescription>
              Visualize os detalhes da sua assinatura atual e gerencie suas
              preferências.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Plano {subscriptionData?.subscription?.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Ativo
                  </Badge>
                </div>
                <CardDescription className="text-2xl font-bold text-foreground">
                  {subscriptionData?.subscription?.price}/mês
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Próxima cobrança</p>
                    <p className="text-muted-foreground">
                      {format(
                        new Date(
                          subscriptionData?.subscription?.currentPeriodEnd,
                        ),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR },
                      )}
                    </p>
                  </div>
                </div> */}

                {/* <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Método de pagamento</p>
                    <p className="text-muted-foreground">
                      {subscription?.}
                    </p>
                  </div>
                </div> */}

                <Separator />

                <div className="text-sm text-muted-foreground">
                  {subscriptionData?.subscription?.createdAt && (
                    <p>
                      Assinatura iniciada em{" "}
                      {format(
                        new Date(subscriptionData.subscription.createdAt),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR },
                      )}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">
                    Cancelar assinatura
                  </p>
                  <p className="mt-1 text-red-700">
                    Ao cancelar, você perderá acesso aos recursos premium no
                    final do período atual.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="w-full sm:w-auto">
              Fechar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              className="w-full bg-red-600 hover:bg-red-700 sm:w-auto"
            >
              {isCancelling ? "Cancelando..." : "Cancelar Assinatura"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SubscriptionDialog
