const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function seedDataBase() {
  try {
    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 60.0,
        imageUrl:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 40.0,
        imageUrl:
          "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para um visual renovado.",
        price: 35.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 20.0,
        imageUrl:
          "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      },
      {
        name: "Massagem",
        description: "Relaxe com uma massagem revigorante.",
        price: 50.0,
        imageUrl:
          "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      },
      {
        name: "Hidratação",
        description: "Hidratação profunda para cabelo e barba.",
        price: 25.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
    ]
    for (const service of services) {
      await prisma.Service.create({
        data: {
          name: service.name,
          description: service.description,
          price: service.price,
          imageURL: service.imageUrl,
        },
      })
    }
    const barbers = [
      {
        name: "Guilherme",
        email: "guilherme@gmail.com",
        password: "123456",
        imageURL:
          "https://images.pexels.com/photos/2076930/pexels-photo-2076930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        name: "Junior",
        email: "junior@gmail.com",
        password: "123456",
        imageURL:
          "https://images.pexels.com/photos/2076930/pexels-photo-2076930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        name: "João",
        email: "joao@gmail.com",
        password: "123456",
        imageURL:
          "https://images.pexels.com/photos/2076930/pexels-photo-2076930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
    ]
    for (const barber of barbers) {
      const createdBarber = await prisma.barber.create({
        data: {
          name: barber.name,
          email: barber.email,
          password: barber.password,
          imageURL: barber.imageURL,
        },
      })

      for (let weekday = 1; weekday <= 5; weekday++) {
        await prisma.availability.create({
          data: {
            barberId: createdBarber.id,
            weekday,
            startTime: "08:00",
            endTime: "18:00",
            slotDuration: 45,
          },
        })
      }
    }

    await prisma.$disconnect()
  } catch (error) {
    console.error("Erro ao popular o banco de dados:", error)
  }
}

seedDataBase()
