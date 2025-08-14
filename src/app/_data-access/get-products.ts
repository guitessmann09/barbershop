"server only"

import { db } from "@/lib/prisma"
import { Product } from "@prisma/client"

export interface ProductDto extends Product {
  status: "in_stock" | "out_of_stock"
}

export const getProducts = async (): Promise<ProductDto[]> => {
  const products = await db.product.findMany({})
  return products.map((product) => ({
    ...product,
    status: product.quantityInStock <= 0 ? "out_of_stock" : "in_stock",
  }))
}
