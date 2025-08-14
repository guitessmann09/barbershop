import { getOrdersWithUser } from "@/app/_data-access/get-orders"
import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import CreateOrderDialog from "./_components/create-order-dialog"
import { getData } from "@/lib/queries"
import { Card, CardHeader } from "@/components/ui/card"

const CheckoutPage = async () => {
  const [orders, { clients }] = await Promise.all([
    getOrdersWithUser(),
    getData(),
  ])
  return (
    <Card className="space-y-4 p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <div className="space-y-2">
          <span className="text-sm font-semibold text-muted-foreground">
            Caixa
          </span>
          <h2 className="text-xl font-semibold">Gestão de comandas</h2>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon size={20} />
              Abrir nova comanda
            </Button>
          </DialogTrigger>
          <CreateOrderDialog clients={clients} />
        </Dialog>
      </CardHeader>
      <DataTable columns={columns} data={orders} />
    </Card>
  )
}

export default CheckoutPage
