/*
  Warnings:

  - Added the required column `LampBssid` to the `LoginInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LastUpdateTime` to the `LoginInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginInfo" ADD COLUMN     "LampBssid" TEXT NOT NULL,
ADD COLUMN     "LastUpdateTime" TEXT NOT NULL;
