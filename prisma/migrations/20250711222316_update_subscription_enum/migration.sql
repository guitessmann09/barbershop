/*
  Warnings:

  - The values [STANDARD,PLUS,PREMIUM] on the enum `Subscription` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Subscription_new" AS ENUM ('DEFAULT', 'CORTE_STANDARD', 'CORTE_PLUS', 'CORTE_PREMIUM', 'BARBA_STANDARD', 'BARBA_PLUS', 'BARBA_PREMIUM', 'CORTE_BARBA_STANDARD', 'CORTE_BARBA_PLUS', 'CORTE_BARBA_PREMIUM');
ALTER TABLE "User" ALTER COLUMN "subscription" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "subscription" TYPE "Subscription_new" USING ("subscription"::text::"Subscription_new");
ALTER TYPE "Subscription" RENAME TO "Subscription_old";
ALTER TYPE "Subscription_new" RENAME TO "Subscription";
DROP TYPE "Subscription_old";
ALTER TABLE "User" ALTER COLUMN "subscription" SET DEFAULT 'DEFAULT';
COMMIT;
