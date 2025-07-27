"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { signOut } from "@/app/_providers/auth-client"
import { useState } from "react"

const LogoutDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const handleLogout = async () => {
    setIsLoading(true)
    await signOut()
    window.location.href = "/home"
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] rounded-xl p-5 text-center">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Sair</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Deseja mesmo sair da plataforma?
          </DialogDescription>
        </DialogHeader>
        <div className="mt-3 flex justify-between gap-[10px]">
          <DialogClose asChild>
            <Button variant="secondary" className="w-full rounded-xl">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="w-full rounded-xl"
            onClick={handleLogout}
            disabled={isLoading}
          >
            Sair
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LogoutDialog
