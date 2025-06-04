import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

const BookingItem = () => {
  return (
    <>
      <h2 className="mt-6 text-xs font-bold uppercase text-gray-500">
        Agendamentos
      </h2>
      <Card className="mt-3">
        <CardContent className="flex justify-between p-0">
          {/* ESQUERDA */}
          <div className="flex flex-col gap-2 py-5 pl-5">
            <Badge className="w-fit">Confirmado</Badge>
            <h3 className="font-semibold">Corte de cabelo</h3>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
              <p className="text-sm">Junior</p>
            </div>
          </div>

          {/* DIREITA */}
          <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
            <p className="text-sm">Junho</p>
            <p className="text-2xl">06</p>
            <p className="text-sm">17:00</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BookingItem
