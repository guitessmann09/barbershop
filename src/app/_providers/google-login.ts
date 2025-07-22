import { signIn } from "@/app/_providers/auth-client"

export const signInWithGoogle = async () => {
  const data = await signIn.social({
    provider: "google",
  })
  return data
}
