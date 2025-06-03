import { Service } from "@prisma/client"
import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

interface ServiceItemProps {
  service: Service
}

const ServiceItem = ({ service }: ServiceItemProps) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 bg-muted p-3">
        <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
          <Image
            alt={service.name}
            src={service.imageURL}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold">{service.name}</h3>
          <p className="text-sm text-gray-500">{service.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-primary">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>
            <Button size="sm" variant="outline">
              Agendar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default ServiceItem
