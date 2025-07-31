"use server"

import { db } from "@/lib/prisma"

interface CreateUserParams {
  data: {
    id: string
    email: string
    name: string
    password: string
    cargo: "admin" | "caixa" | "barbeiro"
  }
}

export const createUser = async ({ data }: CreateUserParams) => {
  await db.user.update({
    where: { id: data.id },
    data: {
      employee: {
        create: {
          cargo: data.cargo,
          ...(data.cargo === "barbeiro" && {
            barber: {
              create: {
                name: data.name,
              },
            },
          }),
        },
      },
    },
  })
}
