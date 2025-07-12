import { CheckIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { Subscription, Benefit } from "@prisma/client"

interface SubscriptionCardProps {
  subscription: Subscription & { benefits: Benefit[] }
}

const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  return (
    <Card className="my-3 min-w-[90%]">
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
    </Card>
  )
}

export default SubscriptionCard
