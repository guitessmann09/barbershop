-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "stripePrice" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeUserId" TEXT;
