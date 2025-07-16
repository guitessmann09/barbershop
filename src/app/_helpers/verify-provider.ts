import getUserWithProvider, { getUserProps } from "./get-user-with-provider"

const verifyProvider = async ({ userId }: getUserProps) => {
  const userWithProvider = await getUserWithProvider({ userId })
  const provider = userWithProvider?.accounts[0].provider
  return provider
}

export default verifyProvider
