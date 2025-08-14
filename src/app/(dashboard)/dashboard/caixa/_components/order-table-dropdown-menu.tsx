"use client"

import { Eye, MoreHorizontal, Trash2Icon } from "lucide-react"

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
import UpdateOrderDialog from "./update-order-dialog"
import { deleteOrderAction } from "@/app/_actions/delete-order"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const OrderTableDropdownMenu = ({ orderId }: { orderId: number }) => {
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
  const router = useRouter()
  const handleDeleteButton = async () => {
    try {
      await deleteOrderAction(orderId)
      toast.success("Comanda cancelada")
      router.refresh()
    } catch (error: any) {
      toast.error(`Erro ao cancelar comanda: ${error.message}`)
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
        <DropdownMenuContent align="end" className="bg-muted">
          <DropdownMenuLabel>Opções</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setEditDialogIsOpen(true)
            }}
          >
            <Eye /> Visualizar comanda
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="bg-destructive"
            onClick={handleDeleteButton}
          >
            <Trash2Icon /> Cancelar comanda
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateOrderDialog
        isOpen={editDialogIsOpen}
        onOpenChange={setEditDialogIsOpen}
        orderId={orderId}
      />
    </>
  )
}

export default OrderTableDropdownMenu
