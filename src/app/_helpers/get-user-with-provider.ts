import { db } from "@/lib/prisma"

export interface getUserProps {
  userId: string
}

const getUserWithProvider = async ({ userId }: getUserProps) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      subscription: true,
      accounts: true,
    },
  })
  return user
}

export default getUserWithProvider
