/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Barber` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Barber_name_key" ON "Barber"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_name_fkey" FOREIGN KEY ("name") REFERENCES "user"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
