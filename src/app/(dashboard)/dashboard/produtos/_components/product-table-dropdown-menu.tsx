"use client"
import { ProductDto } from "@/app/_data-access/get-products"
import UpdateProductDialog from "./update-product-dialog"

interface UpdateProductButtonProps {
  product: ProductDto
}

const UpdateProductButton = ({ product }: UpdateProductButtonProps) => {
  return (
    <>
      <UpdateProductDialog product={product} />
    </>
  )
}

export default UpdateProductButton
