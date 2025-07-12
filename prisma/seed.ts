import { PrismaClient } from "@prisma/client"
// import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function seedDataBase() {
  try {
    const subscriptions = [
      {
        name: "Corte Standard",
        price: 84.9,
        benefits: [
          { description: "Corte ilimiatado de segunda a quarta" },
          { description: "Agenda aberta 7 dias a frente" },
          { description: "5% de desconto nos serviços adicionais" },
        ],
      },
      {
        name: "Corte Plus",
        price: 94.9,
        benefits: [
          { description: "Corte ilimiatado de segunda a sábado" },
          { description: "Agenda aberta 7 dias a frente" },
          { description: "10% de desconto nos serviços adicionais" },
          { description: "5% de desconto na compra de produtos" },
        ],
      },
      {
        name: "Corte Premium",
        price: 139.9,
        benefits: [
          { description: "Corte ilimiatado!" },
          { description: "Presente por fidelidade" },
          { description: "Agenda aberta 30 dias a frente" },
          { description: "Sobrancelha inclusa" },
          { description: "15% de desconto nos serviços adicionais" },
          { description: "15% de desconto na compra de produtos" },
        ],
      },
      {
        name: "Barba Standard",
        price: 99.9,
        benefits: [
          { description: "Barba ilimiatada de segunda a quarta" },
          { description: "Agenda aberta 7 dias a frente" },
          { description: "5% de desconto nos serviços adicionais" },
        ],
      },
      {
        name: "Barba Plus",
        price: 119.9,
        benefits: [
          { description: "Corte ilimiatado de segunda a sábado" },
          { description: "Agenda aberta 7 dias a frente" },
          { description: "10% de desconto nos serviços adicionais" },
          { description: "5% de desconto na compra de produtos" },
        ],
      },
      {
        name: "Barba Premium",
        price: 149.9,
        benefits: [
          { description: "Barba ilimiatada!" },
          { description: "Presente por fidelidade" },
          { description: "Agenda aberta 30 dias a frente" },
          { description: "Sobrancelha inclusa" },
          { description: "15% de desconto nos serviços adicionais" },
          { description: "15% de desconto na compra de produtos" },
        ],
      },
      {
        name: "Corte e Barba Standard",
        price: 179.9,
        benefits: [
          { description: "Corte e barba ilimiatado de segunda a quarta" },
          { description: "Agenda aberta 7 dias a frente" },
          { description: "5% de desconto nos serviços adicionais" },
        ],
      },
      {
        name: "Corte e Barba Plus",
        price: 84.9,
        benefits: [
          { description: "Corte e barba ilimiatado de segunda a sábado" },
          { description: "Agenda aberta 7 dias a frente" },
          { description: "10% de desconto nos serviços adicionais" },
          { description: "5% de desconto na compra de produtos" },
        ],
      },
      {
        name: "Corte e Barba Premium",
        price: 84.9,
        benefits: [
          { description: "Corte e barba ilimiatado!" },
          { description: "Presente por fidelidade" },
          { description: "Agenda aberta 30 dias a frente" },
          { description: "Sobrancelha inclusa" },
          { description: "15% de desconto nos serviços adicionais" },
          { description: "15% de desconto na compra de produtos" },
        ],
      },
    ]

    for (const subscription of subscriptions) {
      await prisma.subscription.create({
        data: {
          name: subscription.name,
          price: subscription.price,
          benefits: {
            create: subscription.benefits.filter(
              (benefit) => benefit !== undefined,
            ),
          },
        },
      })
    }

    // // Limpar dados existentes
    // await prisma.availability.deleteMany({})
    // await prisma.barber.deleteMany({})
    // await prisma.service.deleteMany({})

    // // Criar serviços
    // const services = [
    //   {
    //     name: "Corte de cabelo",
    //     price: 40,
    //     description: "Estilo personalizado com as últimas tendências.",
    //     imageURL:
    //       "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
    //   },
    //   {
    //     name: "Barba",
    //     price: 35,
    //     description: "Modelagem completa para destacar sua masculinidade.",
    //     imageURL:
    //       "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
    //   },
    //   {
    //     name: "Pézinho",
    //     price: 20,
    //     description: "Acabamento perfeito para um visual renovado.",
    //     imageURL:
    //       "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
    //   },
    //   {
    //     name: "Hidratação",
    //     price: 25,
    //     description: "Hidratação profunda para cabelo e barba.",
    //     imageURL:
    //       "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
    //   },
    //   {
    //     name: "Massagem",
    //     price: 50,
    //     description: "Relaxe com uma massagem revigorante.",
    //     imageURL:
    //       "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
    //   },
    //   {
    //     name: "Sobrancelha",
    //     price: 20,
    //     description: "Expressão acentuada com modelagem precisa.",
    //     imageURL:
    //       "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
    //   },
    // ]

    // // Criar serviços
    // for (const service of services) {
    //   await prisma.service.create({
    //     data: service,
    //   })
    // }

    // // Criar barbeiros
    // const barbers = [
    //   {
    //     name: "João Silva",
    //     email: "joao@dandysden.com",
    //     password: await bcrypt.hash("123456", 10),
    //     imageURL:
    //       "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
    //   },
    //   {
    //     name: "Pedro Santos",
    //     email: "pedro@dandysden.com",
    //     password: await bcrypt.hash("123456", 10),
    //     imageURL:
    //       "https://utfs.io/f/c9b4c1f8-1d3f-4b6c-a5c8-6e97dc7d8346-1kgxo7.png",
    //   },
    //   {
    //     name: "Carlos Oliveira",
    //     email: "carlos@dandysden.com",
    //     password: await bcrypt.hash("123456", 10),
    //     imageURL:
    //       "https://utfs.io/f/5c89f046-e4bf-4994-a9f6-e54a2b36302e-1kgxo7.png",
    //   },
    // ]

    // // Criar barbeiros
    // for (const barber of barbers) {
    //   const createdBarber = await prisma.barber.create({
    //     data: barber,
    //   })

    //   // Gerar horários disponíveis (das 8h às 20h, intervalos de 45min)
    //   const availableHours = []
    //   let currentHour = 8 // Início às 8h

    //   while (currentHour < 20) {
    //     // Até às 20h
    //     const minutes = (currentHour % 1) * 60
    //     const hourString = `${Math.floor(currentHour)}:${minutes === 0 ? "00" : minutes}`

    //     availableHours.push(hourString)
    //     currentHour += 0.75 // Adiciona 45 minutos (0.75 horas)
    //   }

    //   // Criar disponibilidades para os próximos 30 dias
    //   const today = new Date()
    //   for (let i = 0; i < 30; i++) {
    //     const date = new Date(today)
    //     date.setDate(today.getDate() + i)

    //     // Pular domingos (0 = domingo)
    //     if (date.getDay() === 0) continue

    //     for (const hour of availableHours) {
    //       await prisma.availability.create({
    //         data: {
    //           barberId: createdBarber.id,
    //           weekday: date.getDay(),
    //           startTime: hour,
    //           endTime: hour,
    //           slotDuration: 45,
    //         },
    //       })
    //     }
    //   }
    // }

    await prisma.$disconnect()
  } catch (error) {
    console.error("Erro ao popular o banco de dados:", error)
  }
}

seedDataBase()
