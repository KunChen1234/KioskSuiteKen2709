/*
  Warnings:

  - A unique constraint covering the columns `[serialnumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_serialnumber_key" ON "User"("serialnumber");
