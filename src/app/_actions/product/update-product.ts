"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"

interface UpdateProductInput {
  id: string
  name: string
  price: number
  stock: number
  isActive: boolean
}

export const updateProduct = async ({
  id,
  name,
  price,
  stock,
  isActive,
}: UpdateProductInput) => {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session) {
    throw new Error("Unauthorized")
  }

  await db.product.update({
    where: { id },
    data: {
      name,
      price,
      quantityInStock: stock,
      isActive,
    },
  })
}
