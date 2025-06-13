/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `devices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "devices" DROP COLUMN "imageUrl",
ADD COLUMN     "images" TEXT[];
