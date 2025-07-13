import Header from "@/components/header"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { redirect } from "next/navigation"
import getUserWithProvider from "../../_helpers/get-user-with-provider"

const SettingsPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const user = session?.user?.id
    ? await getUserWithProvider({ userId: session.user.id })
    : null

  return (
    <>
      <Header user={user} />
      <div className="p-5 lg:px-32">
        <h1 className="mb-6 text-xl font-bold">Configurações</h1>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative h-40 w-40 rounded-lg border border-primary">
            <Image
              src={session?.user.image ?? ""}
              alt={session?.user.name ?? ""}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <h3 className="text-lg">{session?.user.name}</h3>
        </div>
      </div>
    </>
  )
}

export default SettingsPage
