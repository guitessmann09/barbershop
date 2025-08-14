import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"
import { DataTable } from "./_components/data-table"
import { getProducts } from "@/app/_data-access/get-products"
import { productColumns } from "./_components/columns"
import CreateProductDialog from "./_components/create-product-dialog"

const ProductsPage = async () => {
  const products = await getProducts()
  return (
    <Card className="flex h-full flex-col gap-4 p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <div className="space-y-2">
          <span className="text-sm font-semibold text-muted-foreground">
            Estoque
          </span>
          <h2 className="text-xl font-semibold">Gestão de produtos</h2>
        </div>
        <CreateProductDialog />
      </CardHeader>
      <DataTable data={products} columns={productColumns} />
    </Card>
  )
}

export default ProductsPage
