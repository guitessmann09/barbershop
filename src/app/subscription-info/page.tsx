import Header from "@/components/header"
import SubscriptionInfo from "@/components/subscription-info"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import getUserWithProvider from "../_helpers/get-user-with-provider"

const SubscriptionInfoPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/")
  }

  const user = session?.user?.id
    ? await getUserWithProvider({ userId: session.user.id })
    : null

  return (
    <>
      <Header user={user} />
      <div className="p-5 lg:px-32">
        <h1 className="mb-6 text-xl font-bold">Minha Assinatura</h1>
        <SubscriptionInfo userId={user?.id} />
      </div>
    </>
  )
}

export default SubscriptionInfoPage
