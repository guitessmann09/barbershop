"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { headers } from "next/headers"

export async function getProductsAction() {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session) {
    throw new Error("Unauthorized")
  }
  return db.product.findMany({ orderBy: { name: "asc" } })
}
