/*
  Warnings:

  - You are about to drop the column `subscritpion` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscritpion",
ADD COLUMN     "subscription" "Subscription" NOT NULL DEFAULT 'DEFAULT';
