"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2Icon, Edit } from "lucide-react"
import { ProductDto } from "@/app/_data-access/get-products"
import { deleteProduct } from "@/app/_actions/product/delete-product"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ProductTableDropdownMenuProps {
  product: ProductDto
}

const ProductTableDropdownMenu = ({
  product,
}: ProductTableDropdownMenuProps) => {
  const route = useRouter()
  const handleDeleteButton = async (productId: string) => {
    try {
      await deleteProduct(productId)
      toast.success("Produto deletado com sucesso")
      route.refresh()
    } catch (error) {
      console.log(error)
      toast.error("Erro ao deletar o produto")
    }
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-0 bg-muted">
          <DropdownMenuLabel>Opções</DropdownMenuLabel>
          <DropdownMenuItem>
            <Edit /> Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="bg-destructive"
            onClick={() => {
              handleDeleteButton(product.id)
            }}
          >
            <Trash2Icon /> Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ProductTableDropdownMenu
