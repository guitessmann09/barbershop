"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"

interface Product {
  name: string
  price: number
  stock: number
}

export const createProduct = async ({ name, price, stock }: Product) => {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session) {
    throw new Error("Unauthorized")
  }
  await db.product.create({
    data: {
      name,
      price,
      quantityInStock: stock,
    },
  })
}
