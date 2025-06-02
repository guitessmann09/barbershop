const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedDataBase() {
  try {
    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 60.0,
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 40.0,
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para um visual renovado.",
        price: 35.0,
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 20.0,
      },
      {
        name: "Massagem",
        description: "Relaxe com uma massagem revigorante.",
        price: 50.0,
      },
      {
        name: "Hidratação",
        description: "Hidratação profunda para cabelo e barba.",
        price: 25.0,
      },
    ];
    for (const service of services) {
      await prisma.Service.create({
        data: {
          name: service.name,
          description: service.description,
          price: service.price,
        },
      });
    }
    await prisma.$disconnect();
  } catch (error) {
    console.error("Erro ao popular o banco de dados:", error);
  }
}

seedDataBase();
