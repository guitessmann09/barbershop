const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function seedDataBase() {
  try {
    // Limpar dados existentes
    await prisma.availability.deleteMany()
    await prisma.barber.deleteMany()

    const barbers = [
      {
        name: "João Silva",
        email: "joao@dandysden.com",
        password:
          "$2a$10$VxrXPQE6Rx.lMiywXn8UOuV1mkuHoL9.BQtAqhVAe.uZK3Q5fvKRm", // 123456
        imageURL:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Pedro Santos",
        email: "pedro@dandysden.com",
        password:
          "$2a$10$VxrXPQE6Rx.lMiywXn8UOuV1mkuHoL9.BQtAqhVAe.uZK3Q5fvKRm", // 123456
        imageURL:
          "https://utfs.io/f/c9b4c1f8-1d3f-4b6c-a5c8-6e97dc7d8346-1kgxo7.png",
      },
      {
        name: "Carlos Oliveira",
        email: "carlos@dandysden.com",
        password:
          "$2a$10$VxrXPQE6Rx.lMiywXn8UOuV1mkuHoL9.BQtAqhVAe.uZK3Q5fvKRm", // 123456
        imageURL:
          "https://utfs.io/f/5c89f046-e4bf-4994-a9f6-e54a2b36302e-1kgxo7.png",
      },
    ]

    // Criar barbeiros
    for (const barber of barbers) {
      const createdBarber = await prisma.barber.create({
        data: barber,
      })

      // Gerar horários disponíveis (das 8h às 20h, intervalos de 45min)
      const availableHours = []
      let currentHour = 8 // Início às 8h

      while (currentHour < 20) {
        // Até às 20h
        const minutes = (currentHour % 1) * 60
        const hourString = `${Math.floor(currentHour)}:${minutes === 0 ? "00" : minutes}`

        availableHours.push(hourString)
        currentHour += 0.75 // Adiciona 45 minutos (0.75 horas)
      }

      // Criar disponibilidades para os próximos 30 dias
      const today = new Date()
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        // Pular domingos (0 = domingo)
        if (date.getDay() === 0) continue

        for (const hour of availableHours) {
          await prisma.availability.create({
            data: {
              barberId: createdBarber.id,
              weekday: date.getDay(),
              startTime: hour,
              endTime: hour,
              slotDuration: 45,
            },
          })
        }
      }
    }

    await prisma.$disconnect()
  } catch (error) {
    console.error("Erro ao popular o banco de dados:", error)
  }
}

seedDataBase()
