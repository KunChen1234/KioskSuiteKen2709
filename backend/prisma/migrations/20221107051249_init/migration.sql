/*
  Warnings:

  - You are about to drop the column `userSN` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `userSN` on the `Department` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[areaName]` on the table `Area` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[departmentName]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Area" DROP CONSTRAINT "Area_userSN_fkey";

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_userSN_fkey";

-- AlterTable
ALTER TABLE "Area" DROP COLUMN "userSN";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "userSN";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "areaName" TEXT,
ADD COLUMN     "departmentName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Area_areaName_key" ON "Area"("areaName");

-- CreateIndex
CREATE UNIQUE INDEX "Department_departmentName_key" ON "Department"("departmentName");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_areaName_fkey" FOREIGN KEY ("areaName") REFERENCES "Area"("areaName") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentName_fkey" FOREIGN KEY ("departmentName") REFERENCES "Department"("departmentName") ON DELETE SET NULL ON UPDATE CASCADE;
