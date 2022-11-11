/*
  Warnings:

  - Added the required column `isDayShift` to the `LoginInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginInfo" ADD COLUMN     "isDayShift" BOOLEAN NOT NULL;
