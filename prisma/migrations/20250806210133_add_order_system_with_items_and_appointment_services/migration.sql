/*
  Warnings:

  - You are about to drop the `_AppointmentToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AppointmentToService` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_AppointmentToProduct" DROP CONSTRAINT "_AppointmentToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_AppointmentToProduct" DROP CONSTRAINT "_AppointmentToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "_AppointmentToService" DROP CONSTRAINT "_AppointmentToService_A_fkey";

-- DropForeignKey
ALTER TABLE "_AppointmentToService" DROP CONSTRAINT "_AppointmentToService_B_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL;

-- DropTable
DROP TABLE "_AppointmentToProduct";

-- DropTable
DROP TABLE "_AppointmentToService";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "total" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentService" (
    "appointmentId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "AppointmentService_pkey" PRIMARY KEY ("appointmentId","serviceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_appointmentId_key" ON "Order"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_orderId_key" ON "Appointment"("orderId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
