import Image from "next/image"
import { Button } from "./ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

const LoginDialog = () => {
  return (
    <DialogContent className="w-[90%] text-center">
      <DialogHeader>
        <DialogTitle className="text-base font-bold">
          Faça login na plataforma
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Conecte-se usando sua conta do Google.
        </DialogDescription>
      </DialogHeader>
      <Button variant="outline" className="gap-2 rounded-xl font-bold">
        <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
        Google
      </Button>
    </DialogContent>
  )
}

export default LoginDialog
