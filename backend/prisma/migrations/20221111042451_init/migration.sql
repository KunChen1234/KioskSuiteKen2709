/*
  Warnings:

  - You are about to drop the column `serialnumber` on the `LoginInfo` table. All the data in the column will be lost.
  - You are about to drop the column `serialnumber` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `LoginInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LoginInfo" DROP CONSTRAINT "LoginInfo_serialnumber_fkey";

-- DropIndex
DROP INDEX "User_serialnumber_key";

-- AlterTable
ALTER TABLE "LoginInfo" DROP COLUMN "serialnumber",
ADD COLUMN     "userID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "serialnumber",
ADD COLUMN     "userID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_userID_key" ON "User"("userID");

-- AddForeignKey
ALTER TABLE "LoginInfo" ADD CONSTRAINT "LoginInfo_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
