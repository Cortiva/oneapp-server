-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'IT_MANAGER');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('AVAILABLE', 'ASSIGNED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "Location" AS ENUM ('UK', 'IRELAND', 'EU', 'AFRICA', 'AMERICA', 'ASIA');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('DEVELOPER', 'DESIGNER', 'SALES', 'MARKETING', 'HUMAN_RESOURCES', 'FINANCE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'IT_MANAGER',
    "lastLogin" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "refreshToken" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "officeLocation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "model" TEXT,
    "manufacturer" TEXT,
    "screenSize" TEXT,
    "processor" TEXT,
    "ram" INTEGER NOT NULL,
    "storage" INTEGER NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "lastAssigned" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locations" "Location"[],
    "suitableRoles" "EmployeeRole"[],

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "officeLocation" TEXT NOT NULL,
    "role" "EmployeeRole",
    "onboardingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "onboardedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_firstName_lastName_role_idx" ON "users"("email", "firstName", "lastName", "role");

-- CreateIndex
CREATE INDEX "devices_id_model_manufacturer_screenSize_ram_storage_idx" ON "devices"("id", "model", "manufacturer", "screenSize", "ram", "storage");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE INDEX "employees_firstName_lastName_email_phoneNumber_officeLocati_idx" ON "employees"("firstName", "lastName", "email", "phoneNumber", "officeLocation", "role");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_onboardedById_fkey" FOREIGN KEY ("onboardedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
