import { db } from "@/lib/prisma"
import { Service, User } from "@prisma/client"

export interface DiscountInfo {
  discountPercentage: number
  isFree: boolean
  reason: string
}

export interface SubscriptionDiscount {
  serviceId: string
  discountInfo: DiscountInfo
}

/**
 * Verifica se um serviço é gratuito baseado no plano de assinatura
 */

async function isServiceFree(
  serviceId: string,
  subscriptionId: number,
  dayOfWeek: number,
): Promise<boolean> {
  const { corteId, barbaId, sobrancelhaId } = await getServiceIds()

  // Corte Standard: 100% desconto no corte de segunda à quarta (1-3)
  if (
    subscriptionId === 1 &&
    serviceId === corteId &&
    dayOfWeek >= 1 &&
    dayOfWeek <= 3
  ) {
    return true
  }

  // Corte Plus: 100% desconto no corte de segunda à sábado (1-6)
  if (
    subscriptionId === 2 &&
    serviceId === corteId &&
    dayOfWeek >= 1 &&
    dayOfWeek <= 6
  ) {
    return true
  }

  // Corte Premium: 100% desconto no corte e sobrancelha de segunda à sábado (1-6)
  if (
    subscriptionId === 3 &&
    (serviceId === corteId || serviceId === sobrancelhaId) &&
    dayOfWeek >= 1 &&
    dayOfWeek <= 6
  ) {
    return true
  }

  // Barba Standard: 100% desconto na barba de segunda à quarta (1-3)
  if (
    subscriptionId === 4 &&
    serviceId === barbaId &&
    dayOfWeek >= 1 &&
    dayOfWeek <= 3
  ) {
    return true
  }

  // Barba Plus: 100% desconto na barba de segunda à sábado (1-6)
  if (
    subscriptionId === 5 &&
    serviceId === barbaId &&
    dayOfWeek >= 1 &&
    dayOfWeek <= 6
  ) {
    return true
  }

  // Barba Premium: 100% desconto na barba e sobrancelha de segunda à sábado (1-6)
  if (
    subscriptionId === 6 &&
    (serviceId === barbaId || serviceId === sobrancelhaId) &&
    dayOfWeek >= 1 &&
    dayOfWeek <= 6
  ) {
    return true
  }

  // Corte e Barba Standard: 100% desconto no corte e barba de segunda à quarta (1-3)
  if (
    subscriptionId === 7 &&
    (serviceId === corteId || serviceId === barbaId) &&
    dayOfWeek >= 1 &&
    dayOfWeek <= 3
  ) {
    return true
  }

  // Corte e Barba Plus: 100% desconto no corte e barba de segunda à sábado (1-6)
  if (
    subscriptionId === 8 &&
    (serviceId === corteId || serviceId === barbaId) &&
    dayOfWeek >= 1 &&
    dayOfWeek <= 6
  ) {
    return true
  }

  // Corte e Barba Premium: 100% desconto no corte, barba e sobrancelha de segunda à sábado (1-6)
  if (
    subscriptionId === 9 &&
    (serviceId === corteId ||
      serviceId === barbaId ||
      serviceId === sobrancelhaId) &&
    dayOfWeek >= 1 &&
    dayOfWeek <= 6
  ) {
    return true
  }

  return false
}

/**
 * Obtém a porcentagem de desconto para serviços adicionais baseado no plano
 */
async function getAdditionalServiceDiscount(
  subscriptionId: number,
): Promise<number> {
  const subscription = await db.subscription.findFirst({
    where: { id: subscriptionId },
  })

  if (subscription?.name.toLowerCase().includes("standard")) {
    return 5
  }

  if (subscription?.name.toLowerCase().includes("plus")) {
    return 10
  }

  if (subscription?.name.toLowerCase().includes("premium")) {
    return 15
  }

  return 0
}

/**
 * Calcula o desconto para um serviço específico baseado no plano de assinatura do usuário
 */
export async function calculateServiceDiscount(
  service: Service,
  user: User,
  appointmentDate: Date,
): Promise<DiscountInfo> {
  // Se o usuário não tem assinatura, não há desconto
  if (!user.subscriptionId) {
    return {
      discountPercentage: 0,
      isFree: false,
      reason: "Sem assinatura ativa",
    }
  }

  const dayOfWeek = appointmentDate.getDay() // 0 = domingo, 1 = segunda, etc.
  const subscription = await db.subscription.findFirst({
    where: { id: user.subscriptionId },
  })

  // Verifica se o serviço é gratuito
  const isFree = await isServiceFree(service.id, user.subscriptionId, dayOfWeek)
  if (isFree) {
    return {
      discountPercentage: 100,
      isFree,
      reason: `Serviço incluído no plano ${subscription?.name}`,
    }
  }

  // Verifica desconto para serviços adicionais
  const additionalDiscount = await getAdditionalServiceDiscount(
    user.subscriptionId,
  )

  if (additionalDiscount > 0) {
    return {
      discountPercentage: additionalDiscount,
      isFree: false,
      reason: `${additionalDiscount}% de desconto em serviços adicionais`,
    }
  }

  return {
    discountPercentage: 0,
    isFree: false,
    reason: "Sem desconto aplicável",
  }
}

/**
 * Calcula o preço final com desconto aplicado
 */
export function calculateFinalPrice(
  originalPrice: number,
  discountInfo: DiscountInfo,
): number {
  if (discountInfo.isFree) {
    return 0
  }

  const discountAmount = (originalPrice * discountInfo.discountPercentage) / 100
  return originalPrice - discountAmount
}

/**
 * Obtém informações de desconto para todos os serviços de um usuário
 */
export async function getUserServiceDiscounts(
  services: Service[],
  user: User & { subscription?: { name: string } | null },
  appointmentDate: Date,
): Promise<SubscriptionDiscount[]> {
  const discountPromises = services.map(async (service) => ({
    serviceId: service.id,
    discountInfo: await calculateServiceDiscount(
      service,
      user,
      appointmentDate,
    ),
  }))

  return Promise.all(discountPromises)
}

/**
 * Verifica se um serviço está disponível gratuitamente em uma data específica
 */
export async function isServiceAvailableForFree(
  serviceName: string,
  subscriptionId: number,
  date: Date,
): Promise<boolean> {
  const dayOfWeek = date.getDay()
  return await isServiceFree(serviceName, subscriptionId, dayOfWeek)
}

/**
 * Busca os IDs dos serviços principais no banco de dados
 */
export async function getServiceIds() {
  // Altere os nomes conforme estão cadastrados no banco
  const corte = await db.service.findFirst({
    where: { name: { contains: "corte", mode: "insensitive" } },
  })
  const barba = await db.service.findFirst({
    where: { name: { contains: "barba", mode: "insensitive" } },
  })
  const sobrancelha = await db.service.findFirst({
    where: { name: { contains: "sobrancelha", mode: "insensitive" } },
  })

  return {
    corteId: corte?.id,
    barbaId: barba?.id,
    sobrancelhaId: sobrancelha?.id,
  }
}
