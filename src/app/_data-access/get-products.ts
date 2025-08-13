"server only"

import { db } from "@/lib/prisma"

export async function getProducts() {
  return db.product.findMany({ orderBy: { name: "asc" } })
}
