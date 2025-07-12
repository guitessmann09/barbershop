import { db } from "@/lib/prisma"

interface getUserProps {
  userId: string
}

const getUser = async ({ userId }: getUserProps) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  })
  return user
}

export default getUser
