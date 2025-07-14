import Header from "@/components/header"
import SubscriptionCard from "@/components/subscription-card"
import { authOptions } from "@/lib/auth"
import { getData } from "@/lib/queries"
import { getServerSession } from "next-auth"
import getUserWithProvider from "../_helpers/get-user-with-provider"

const SubscriptionsPage = async () => {
  const session = await getServerSession(authOptions)
  const { subscriptions } = await getData()
  const user = session?.user?.id
    ? await getUserWithProvider({ userId: session.user.id })
    : null
  return (
    <>
      <Header user={user} />
      <div className="p-5 lg:px-32">
        <h2 className="text-xl font-bold">Clube de Cavalheiros</h2>
        <div>
          <h2 className="mt-3 text-xs font-bold uppercase text-gray-500">
            Assinatura corte
          </h2>
          <div className="flex flex-row gap-4 overflow-x-scroll lg:grid lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
            {subscriptions
              .filter(
                (sub) =>
                  sub.name.includes("Corte") && !sub.name.includes("Barba"),
              )
              .sort((a, b) => Number(a.price) - Number(b.price))
              .map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  userId={user?.id as string}
                  userSubscriptionId={user?.subscription?.id}
                />
              ))}
          </div>
        </div>
        <div>
          <h2 className="mt-3 text-xs font-bold uppercase text-gray-500">
            Assinatura barba
          </h2>
          <div className="flex flex-row gap-4 overflow-x-scroll lg:grid lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
            {subscriptions
              .filter(
                (sub) =>
                  sub.name.includes("Barba") &&
                  !sub.name.includes("Corte e Barba"),
              )
              .sort((a, b) => Number(a.price) - Number(b.price))
              .map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  userId={user?.id as string}
                  userSubscriptionId={user?.subscription?.id}
                />
              ))}
          </div>
        </div>
        <div>
          <h2 className="mt-3 text-xs font-bold uppercase text-gray-500">
            Assinatura corte e barba
          </h2>
          <div className="flex flex-row gap-4 overflow-x-scroll lg:grid lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
            {subscriptions
              .filter((sub) => sub.name.includes("Corte e Barba"))
              .sort((a, b) => Number(a.price) - Number(b.price))
              .map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  userId={user?.id as string}
                  userSubscriptionId={user?.subscription?.id}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SubscriptionsPage
