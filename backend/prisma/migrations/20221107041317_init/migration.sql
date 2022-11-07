/*
  Warnings:

  - You are about to drop the column `userId` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Department` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Area" DROP CONSTRAINT "Area_userId_fkey";

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_userId_fkey";

-- AlterTable
ALTER TABLE "Area" DROP COLUMN "userId",
ADD COLUMN     "userSN" TEXT;

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "userId",
ADD COLUMN     "userSN" TEXT;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_userSN_fkey" FOREIGN KEY ("userSN") REFERENCES "User"("serialnumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_userSN_fkey" FOREIGN KEY ("userSN") REFERENCES "User"("serialnumber") ON DELETE SET NULL ON UPDATE CASCADE;
