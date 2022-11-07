/*
  Warnings:

  - You are about to drop the column `color` on the `Area` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Area" DROP COLUMN "color",
ADD COLUMN     "areacolor" TEXT;
