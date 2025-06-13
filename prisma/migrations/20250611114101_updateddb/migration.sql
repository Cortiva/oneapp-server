/*
  Warnings:

  - Added the required column `staffId` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staffId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "staffId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountStatus" "AccountStatus" NOT NULL DEFAULT 'INACTIVE',
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "staffId" TEXT NOT NULL,
ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationCodeExpiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "tokenBlacklists" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokenBlacklists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokenBlacklists_token_key" ON "tokenBlacklists"("token");
