/*
  Warnings:

  - Added the required column `LoginTime` to the `LoginInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginInfo" ADD COLUMN     "LoginTime" TEXT NOT NULL;
