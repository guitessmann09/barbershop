"use client"

import { CheckSquare, Edit, MoreHorizontal, Trash2Icon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import EditOrderDialog from "./edit-order-dialog"
import { deleteOrderAction } from "@/app/_actions/delete-order"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const OrderTableDropdownMenu = ({ orderId }: { orderId: number }) => {
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-muted">
          <DropdownMenuLabel>Opções</DropdownMenuLabel>
          <DropdownMenuItem>
            <CheckSquare />
            Fechar comanda
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setEditDialogIsOpen(true)
            }}
          >
            <Edit /> Editar comanda
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="bg-destructive"
            onClick={async () => {
              try {
                await deleteOrderAction(orderId)
                toast.success("Comanda cancelada")
                router.refresh()
              } catch (e: any) {
                toast.error(`Erro ao cancelar comanda: ${e.message}`)
              }
            }}
          >
            <Trash2Icon /> Cancelar comanda
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditOrderDialog
        isOpen={editDialogIsOpen}
        onOpenChange={setEditDialogIsOpen}
        orderId={orderId}
      />
    </>
  )
}

export default OrderTableDropdownMenu
