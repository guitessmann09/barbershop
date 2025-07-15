"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { CheckIcon, CreditCard, Calendar, AlertCircle } from "lucide-react"
import { format, sub } from "date-fns"
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

const SubscriptionInfo = ({ userId }: SubscriptionInfoProps) => {
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/subscription")

        if (!response.ok) {
          throw new Error("Erro ao buscar assinatura")
        }

        const data = await response.json()
        setSubscriptionData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchSubscription()
    }
  }, [userId])

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={20} />
            <span>Erro: {error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscriptionData?.subscription) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Informações da Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {subscriptionData?.message ||
              "Você não possui uma assinatura ativa"}
          </p>
        </CardContent>
      </Card>
    )
  }

  const { subscription } = subscriptionData

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={20} />
          {subscription.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Preço:</span>
          <span className="font-semibold text-primary">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(subscription.price)}
          </span>
        </div>

        {subscription.createdAt && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Datas da Assinatura:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Contratada em:</span>
                <span className="font-medium">
                  {format(
                    new Date(subscription.createdAt),
                    "dd/MM/yyyy 'às' HH:mm",
                    { locale: ptBR },
                  )}
                </span>
              </div>

              {subscription.nextBillingDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Próxima cobrança:
                  </span>
                  <span className="font-medium">
                    {format(
                      new Date(subscription.nextBillingDate),
                      "dd/MM/yyyy",
                      { locale: ptBR },
                    )}
                  </span>
                </div>
              )}

              {subscription.currentPeriodStart && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Período atual:</span>
                  <span className="font-medium">
                    {format(
                      new Date(subscription.currentPeriodStart),
                      "dd/MM/yyyy",
                      { locale: ptBR },
                    )}{" "}
                    -{" "}
                    {format(
                      new Date(
                        subscription.currentPeriodEnd ||
                          subscription.nextBillingDate ||
                          "",
                      ),
                      "dd/MM/yyyy",
                      { locale: ptBR },
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Benefícios:</h4>
          <ul className="space-y-1">
            {subscription.benefits.map((benefit) => (
              <li key={benefit.id} className="flex items-center gap-2 text-sm">
                <CheckIcon size={16} className="text-green-600" />
                {benefit.description}
              </li>
            ))}
          </ul>
        </div>

        {subscription.stripeCustomer && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16} />
              <span>Cliente Stripe: {subscription.stripeCustomer.id}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SubscriptionInfo
