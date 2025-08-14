"use client"

import { ProductDto } from "@/app/_data-access/get-products"
import { getFormattedCurrency } from "@/app/_helpers/format-currency"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import ProductTableDropdownMenu from "./product-table-dropdown-menu"

export const productColumns: ColumnDef<ProductDto>[] = [
  {
    accessorKey: "name",
    header: "Produto",
  },
  {
    accessorKey: "price",
    header: "Valor unitário",
    cell: ({ row }) => {
      const formattedPrice = getFormattedCurrency(Number(row.original.price))
      return <span>{formattedPrice}</span>
    },
  },
  {
    accessorKey: "quantityInStock",
    header: "Estoque",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status =
        row.original.status === "in_stock" ? "Em estoque" : "Esgotado"
      return (
        <Badge variant={status === "Em estoque" ? "default" : "destructive"}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Opções",
    cell: ({ row }) => {
      const product = row.original
      return <ProductTableDropdownMenu product={product} />
    },
  },
]
