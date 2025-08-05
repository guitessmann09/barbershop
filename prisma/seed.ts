import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedDataBase() {
  try {
    // const subscriptions = [
    //   {
    //     name: "Corte Standard",
    //     price: 84.9,
    //     benefits: [
    //       { description: "Corte ilimiatado de segunda a quarta" },
    //       { description: "Agenda aberta 7 dias a frente" },
    //       { description: "5% de desconto nos serviços adicionais" },
    //     ],
    //   },
    //   {
    //     name: "Corte Plus",
    //     price: 94.9,
    //     benefits: [
    //       { description: "Corte ilimiatado de segunda a sábado" },
    //       { description: "Agenda aberta 7 dias a frente" },
    //       { description: "10% de desconto nos serviços adicionais" },
    //       { description: "5% de desconto na compra de produtos" },
    //     ],
    //   },
    //   {
    //     name: "Corte Premium",
    //     price: 139.9,
    //     benefits: [
    //       { description: "Corte ilimiatado!" },
    //       { description: "Presente por fidelidade" },
    //       { description: "Agenda aberta 30 dias a frente" },
    //       { description: "Sobrancelha inclusa" },
    //       { description: "15% de desconto nos serviços adicionais" },
    //       { description: "15% de desconto na compra de produtos" },
    //     ],
    //   },
    //   {
    //     name: "Barba Standard",
    //     price: 99.9,
    //     benefits: [
    //       { description: "Barba ilimiatada de segunda a quarta" },
    //       { description: "Agenda aberta 7 dias a frente" },
    //       { description: "5% de desconto nos serviços adicionais" },
    //     ],
    //   },
    //   {
    //     name: "Barba Plus",
    //     price: 119.9,
    //     benefits: [
    //       { description: "Corte ilimiatado de segunda a sábado" },
    //       { description: "Agenda aberta 7 dias a frente" },
    //       { description: "10% de desconto nos serviços adicionais" },
    //       { description: "5% de desconto na compra de produtos" },
    //     ],
    //   },
    //   {
    //     name: "Barba Premium",
    //     price: 149.9,
    //     benefits: [
    //       { description: "Barba ilimiatada!" },
    //       { description: "Presente por fidelidade" },
    //       { description: "Agenda aberta 30 dias a frente" },
    //       { description: "Sobrancelha inclusa" },
    //       { description: "15% de desconto nos serviços adicionais" },
    //       { description: "15% de desconto na compra de produtos" },
    //     ],
    //   },
    //   {
    //     name: "Corte e Barba Standard",
    //     price: 179.9,
    //     benefits: [
    //       { description: "Corte e barba ilimiatado de segunda a quarta" },
    //       { description: "Agenda aberta 7 dias a frente" },
    //       { description: "5% de desconto nos serviços adicionais" },
    //     ],
    //   },
    //   {
    //     name: "Corte e Barba Plus",
    //     price: 84.9,
    //     benefits: [
    //       { description: "Corte e barba ilimiatado de segunda a sábado" },
    //       { description: "Agenda aberta 7 dias a frente" },
    //       { description: "10% de desconto nos serviços adicionais" },
    //       { description: "5% de desconto na compra de produtos" },
    //     ],
    //   },
    //   {
    //     name: "Corte e Barba Premium",
    //     price: 84.9,
    //     benefits: [
    //       { description: "Corte e barba ilimiatado!" },
    //       { description: "Presente por fidelidade" },
    //       { description: "Agenda aberta 30 dias a frente" },
    //       { description: "Sobrancelha inclusa" },
    //       { description: "15% de desconto nos serviços adicionais" },
    //       { description: "15% de desconto na compra de produtos" },
    //     ],
    //   },
    // ]

    // for (const subscription of subscriptions) {
    //   await prisma.subscription.create({
    //     data: {
    //       name: subscription.name,
    //       price: subscription.price,
    //       benefits: {
    //         create: subscription.benefits.filter(
    //           (benefit) => benefit !== undefined,
    //         ),
    //       },
    //     },
    //   })
    // }

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

    // Criar disponibilidade dos barbeiros
    // Buscar todos os barbeiros cadastrados

    await prisma.availability.deleteMany({})

    const barbeiros = await prisma.barber.findMany()
    // Para cada barbeiro, criar as disponibilidades padrão
    for (const barbeiro of barbeiros) {
      const disponibilidades = [
        // Segunda a sexta (weekday 1 a 5): 10h às 20h
        ...Array.from({ length: 5 }, (_, i) => ({
          barberId: barbeiro.id,
          weekday: i + 1, // 1 = segunda, 5 = sexta
          startTime: "10:00",
          endTime: "20:00",
          slotDuration: 10,
        })),
        // Sábado (weekday 6): 10h às 18h
        {
          barberId: barbeiro.id,
          weekday: 6,
          startTime: "10:00",
          endTime: "18:00",
          slotDuration: 10,
        },
        // Domingo (weekday 0) - não cadastra disponibilidade
      ]

      for (const disponibilidade of disponibilidades) {
        await prisma.availability.create({
          data: disponibilidade,
        })
      }
    }
    await prisma.$disconnect()
  } catch (error) {
    console.error("Erro ao popular o banco de dados:", error)
  }
}

seedDataBase()
