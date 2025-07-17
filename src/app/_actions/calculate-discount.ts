"use server"

import { calculateServiceDiscount } from "@/app/_helpers/get-discount"
import { Service } from "@prisma/client"
import { UserData } from "./get-user-data"

export const calculateDiscountAction = async (
  service: Service,
  userData: UserData,
  bookingDate: Date,
) => {
  try {
    return await calculateServiceDiscount(service, userData, bookingDate)
  } catch (error) {
    console.error("Erro ao calcular desconto:", error)
    return {
      discountPercentage: 0,
      isFree: false,
      reason: "Erro ao calcular desconto",
    }
  }
}
