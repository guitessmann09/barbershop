import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/prisma"
import { Clock, User } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Separator } from "@/components/ui/separator"
import { Barber } from "@prisma/client"

const Calendar = async () => {
  const barbers = await db.barber.findMany({})
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock />
          <p>
            <span className="text-sm capitalize text-white">
              {format(new Date(), "EEEE, d", { locale: ptBR })}
            </span>
            <span className="text-sm text-white"> de </span>
            <span className="text-sm capitalize text-white">
              {format(new Date(), "MMMM", { locale: ptBR })}
            </span>
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-screen overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="mb-4 grid grid-cols-5 gap-2">
              <div className="p-2 text-sm font-semibold text-muted-foreground">
                Horário
              </div>
              {barbers.map((barber) => (
                <div key={barber.id} className="text-center">
                  <div className="flex items-center justify-center gap-4 font-semibold">
                    {!barber.imageUrl ? (
                      <User className="h-10 w-10 rounded-full bg-secondary p-2" />
                    ) : (
                      <div className="relative h-10 w-10">
                        <Image
                          src={barber?.imageUrl || ""}
                          alt={barber.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    {barber.name}
                  </div>
                  <Separator orientation="vertical" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Calendar
