/*
  Warnings:

  - You are about to drop the column `assignedToId` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `lastAssigned` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `locations` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `suitableRoles` on the `devices` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_assignedToId_fkey";

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "assignedToId",
DROP COLUMN "lastAssigned",
DROP COLUMN "locations",
DROP COLUMN "suitableRoles";

-- CreateTable
CREATE TABLE "employeeDevices" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "assignedOn" TIMESTAMP(3),
    "assignedById" TEXT NOT NULL,
    "retrievedOn" TIMESTAMP(3),
    "retrievedById" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employeeDevices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "employeeDevices_id_employeeId_deviceId_assignedOn_idx" ON "employeeDevices"("id", "employeeId", "deviceId", "assignedOn");

-- AddForeignKey
ALTER TABLE "employeeDevices" ADD CONSTRAINT "employeeDevices_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeDevices" ADD CONSTRAINT "employeeDevices_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeDevices" ADD CONSTRAINT "employeeDevices_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeDevices" ADD CONSTRAINT "employeeDevices_retrievedById_fkey" FOREIGN KEY ("retrievedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
