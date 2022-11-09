/*
  Warnings:

  - You are about to drop the column `areacolor` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `departmentcolor` on the `Department` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Area" DROP COLUMN "areacolor",
ADD COLUMN     "areaColor" TEXT;

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "departmentcolor",
ADD COLUMN     "departmentColor" TEXT;
