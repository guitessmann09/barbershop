"use client"

import { LogIn } from "lucide-react"
import { Button } from "./ui/button"
import LoginDialog from "./login-dialog"
import { useState } from "react"

const LoginButton = () => {
  const [loginDialogIsOpen, setLoginDialogIsOpen] = useState(false)

  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => {
          setLoginDialogIsOpen(true)
        }}
      >
        <LogIn size={18} />
        <span className="text-sm font-bold">Login</span>
      </Button>
      <LoginDialog
        isOpen={loginDialogIsOpen}
        onOpenChange={setLoginDialogIsOpen}
      />
    </div>
  )
}

export default LoginButton
