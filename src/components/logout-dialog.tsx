import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { signOut } from "next-auth/react"

const LogoutDialog = () => {
  return (
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
          onClick={() => signOut()}
        >
          Sair
        </Button>
      </div>
    </DialogContent>
  )
}

export default LogoutDialog
