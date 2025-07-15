"use client"

import { CheckIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import { Separator } from "../../../components/ui/separator"
import { Subscription, Benefit, User } from "@prisma/client"
import { Button } from "../../../components/ui/button"
import { createStripeCheckoutBySubscription } from "@/app/subscriptions/_stripe/create-stripe-checkout"
import { loadStripe } from "@stripe/stripe-js"
import LoginDialog from "../../../components/login-dialog"
import { useState } from "react"

interface SubscriptionCardProps {
  subscription: Subscription & { benefits: Benefit[] }
  userId: string
  userSubscriptionId: Number | undefined
}

const SubscriptionCard = ({
  subscription,
  userSubscriptionId,
  userId,
}: SubscriptionCardProps) => {
  const [loginDialogIsOpen, setLoginDialogIsOpen] = useState(false)
  const handleSubscriptionClick = async () => {
    const { sessionId } = await createStripeCheckoutBySubscription({
      userId: userId,
      subscriptionId: subscription.id,
    })
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error("Stripe publishable key not found")
    }
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    )
    if (!stripe) {
      throw new Error("Stripe not found")
    }
    await stripe.redirectToCheckout({ sessionId })
  }

  return (
    <Card className="my-3 flex min-w-[90%] flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle>{subscription.name}</CardTitle>
        <span className="font-semibold text-primary">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(subscription.price))}
        </span>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 pt-3">
        <ul className="flex flex-col gap-2 text-sm">
          {subscription.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <CheckIcon size={16} />
              <li>{benefit.description}</li>
            </div>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="h-full items-end justify-end">
        {!userSubscriptionId && (
          <>
            <Button
              onClick={() => {
                if (!userId) {
                  setLoginDialogIsOpen(true)
                } else {
                  handleSubscriptionClick()
                }
              }}
            >
              Assinar plano
            </Button>
            <LoginDialog
              isOpen={loginDialogIsOpen}
              onOpenChange={setLoginDialogIsOpen}
            />
          </>
        )}
      </CardFooter>
    </Card>
  )
}

export default SubscriptionCard
