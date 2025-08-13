"use client"

import { getFormattedCurrency } from "@/app/_helpers/format-currency"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import { OrderWithUser } from "@/app/_data-access/get-orders"
import OrderTableDropdownMenu from "./order-table-dropdown-menu"

export const columns: ColumnDef<OrderWithUser>[] = [
  {
    accessorKey: "user",
    header: "Cliente",
    cell: ({ row }) => {
      const user = row.original.user
      const display = user?.name || user?.email || row.original.userId
      return <span>{display}</span>
    },
  },
  {
    accessorKey: "total",
    header: "Valor",
    cell: ({ row }) => {
      const totalFormatted = getFormattedCurrency(row.getValue("total"))
      return <span>{totalFormatted}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status === "pending" ? "Pendente" : "Pago"
      return (
        <Badge variant={status === "Pendente" ? "destructive" : "default"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="bg-transparent p-0 hover:bg-transparent hover:text-muted-foreground"
        >
          Criado em
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const formattedDate = format(
        new Date(row.getValue("createdAt")),
        "dd/MM/yyyy HH:mm",
        {
          locale: ptBR,
        },
      )
      return <span>{formattedDate}</span>
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="bg-transparent p-0 hover:bg-transparent hover:text-muted-foreground"
        >
          Atualizado em
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const formattedDate = format(
        new Date(row.getValue("updatedAt")),
        "dd/MM/yyyy HH:mm",
        {
          locale: ptBR,
        },
      )
      return <span>{formattedDate}</span>
    },
  },
  {
    id: "actions",
    header: "Opções",
    cell: ({ row }) => {
      const orderId = row.original.id
      return <OrderTableDropdownMenu orderId={orderId} />
    },
  },
]
