import { UserIcon } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"

interface BarberCardProps {
  name: string
  image: string
}

const BarberCard = ({ name, image }: BarberCardProps) => {
  return (
    <Card className="min-w-[200px]">
      <CardContent className="flex h-full flex-col items-center justify-center gap-2 rounded-full p-5">
        <div className="relative h-[100px] w-[100px]">
          {image ? (
            <Image
              src={image}
              alt="Barber"
              fill
              className="rounded-full border border-primary object-cover"
            />
          ) : (
            <UserIcon className="h-10 w-10 text-gray-500" />
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-gray-500">Barbeiro</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarberCard
