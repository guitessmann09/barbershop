"use client"

import { useState } from "react"
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
import { Calendar, User, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getFormattedCurrency } from "../../_helpers/format-currency"
import { getUserSubscription } from "../../_actions/get-user-subscription"
import { UserSubscriptionInfo } from "@/app/_actions/get-user-subscription"
import Spinner from "@/components/ui/spinner"
import { cancelSubscription } from "../_stripe/cancel-subscription"

interface SubscriptionInfoProps {
  userId?: string
}

const SubscriptionDialog = ({ userId }: SubscriptionInfoProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [subscriptionData, setSubscriptionData] =
    useState<UserSubscriptionInfo | null>(null)

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true)
      const subscription = await getUserSubscription()
      setSubscriptionData(subscription)
    } catch (error) {
      throw new Error()
    } finally {
      setLoading(false)
    }

    const subscription = await getUserSubscription()
    setSubscriptionData(subscription)
  }

  console.log(subscriptionData)

  const handleCancelClick = async () => {
    if (!userId || !subscriptionData?.stripeSubscription.id) return
    await cancelSubscription({
      userId,
      stripeSubscriptionId: subscriptionData.stripeSubscription.id,
    })
  }

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild onClick={fetchSubscriptionData}>
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

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Plano {subscriptionData?.name}
                      </CardTitle>
                      <Badge
                        variant={
                          !subscriptionData?.subscriptionEndDate
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {subscriptionData?.subscriptionEndDate ? (
                          <span>Cancelada</span>
                        ) : (
                          <span>Ativa</span>
                        )}
                      </Badge>
                    </div>
                    <CardDescription className="text-2xl font-bold text-foreground">
                      {getFormattedCurrency(subscriptionData?.price ?? 0)}
                      /mês
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        {subscriptionData?.subscriptionEndDate ? (
                          <>
                            <p className="font-medium">Assinatura válida até</p>
                            <p className="text-muted-foreground">
                              {format(
                                subscriptionData.subscriptionEndDate,
                                "dd/MM/yyyy",
                                { locale: ptBR },
                              )}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">Próxima cobrança</p>
                            <p className="text-muted-foreground">
                              {subscriptionData?.nextBillingDate
                                ? format(
                                    subscriptionData.nextBillingDate,
                                    "dd/MM/yyyy",
                                    { locale: ptBR },
                                  )
                                : ""}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <Separator />

                    <div className="text-sm text-muted-foreground">
                      {subscriptionData?.createdAt && (
                        <p>
                          Assinatura iniciada em{" "}
                          {format(
                            new Date(subscriptionData.createdAt),
                            "dd/MM/yyyy",
                            { locale: ptBR },
                          )}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {!subscriptionData?.subscriptionEndDate && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" />
                      <div className="text-sm">
                        <p className="font-medium text-red-800">
                          Cancelar assinatura
                        </p>
                        <p className="mt-1 text-red-700">
                          Ao cancelar, você perderá acesso aos benefícios no
                          final do período atual.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                <AlertDialogCancel className="w-full sm:w-auto">
                  Fechar
                </AlertDialogCancel>
                {!subscriptionData?.subscriptionEndDate && (
                  <AlertDialogAction
                    onClick={handleCancelClick}
                    className="w-full bg-red-600 hover:bg-red-700 sm:w-auto"
                  >
                    {isCancelling ? "Cancelando..." : "Cancelar Assinatura"}
                  </AlertDialogAction>
                )}
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SubscriptionDialog
