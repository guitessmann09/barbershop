"use client"

import Image from "next/image"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { signIn } from "next-auth/react"

const LoginDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const handleLoginWithGoogle = async () => {
    await signIn("google")
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] rounded-xl text-center">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Faça login na plataforma
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Conecte-se usando sua conta do Google.
          </DialogDescription>
        </DialogHeader>
        <Button
          variant="outline"
          className="gap-2 rounded-xl font-bold"
          onClick={handleLoginWithGoogle}
        >
          <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
          Google
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
