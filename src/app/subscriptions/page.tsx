import Header from "@/components/header"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const SubscriptionsPage = async () => {
  const session = await getServerSession(authOptions)
  return (
    <>
      <Header user={session?.user as any} />
      <div>
        <h2 className="text-xl font-bold">Assinaturas</h2>
      </div>
    </>
  )
}

export default SubscriptionsPage
