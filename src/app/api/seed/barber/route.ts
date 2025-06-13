import { NextResponse } from "next/server"
import { db } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function PATCH() {
  const email = "carlos@dandysden.com"
  const newPassword = "123456"

  const existing = await db.barber.findUnique({
    where: { email },
  })

  if (!existing) {
    return NextResponse.json(
      { message: "Barbeiro não encontrado" },
      { status: 404 },
    )
  }

  const hashedPassword = await hash(newPassword, 10)

  const barber = await db.barber.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  })

  return NextResponse.json({
    message: "Senha atualizada com sucesso!",
    barber,
  })
}
