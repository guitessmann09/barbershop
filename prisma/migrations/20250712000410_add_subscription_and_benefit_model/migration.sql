/*
  Warnings:

  - You are about to drop the column `subscription` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscription",
ADD COLUMN     "subscriptionID" INTEGER;

-- DropEnum
DROP TYPE "Subscription";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benefit" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "subscriptionID" INTEGER NOT NULL,

    CONSTRAINT "Benefit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_subscriptionID_fkey" FOREIGN KEY ("subscriptionID") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benefit" ADD CONSTRAINT "Benefit_subscriptionID_fkey" FOREIGN KEY ("subscriptionID") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
