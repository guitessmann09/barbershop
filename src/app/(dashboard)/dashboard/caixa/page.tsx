import { getOrdersWithUser } from "@/app/_data-access/get-orders"
import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

const CheckoutPage = async () => {
  const orders = await getOrdersWithUser()
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gestão de comandas</h2>
        <Button className="gap-2">
          <PlusIcon size={20} />
          Abrir nova comanda
        </Button>
      </div>
      <DataTable columns={columns} data={orders} />
    </div>
  )
}

export default CheckoutPage
