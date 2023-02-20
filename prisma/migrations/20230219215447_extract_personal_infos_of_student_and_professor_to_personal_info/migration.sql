/*
  Warnings:

  - You are about to drop the column `addressId` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personalInfoId]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[personalInfoId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `personalInfoId` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personalInfoId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Professor" DROP CONSTRAINT "Professor_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_addressId_fkey";

-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Professor" DROP COLUMN "addressId",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "personalInfoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "addressId",
DROP COLUMN "birthDate",
DROP COLUMN "createdAt",
DROP COLUMN "deleted",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "updatedAt",
ADD COLUMN     "personalInfoId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PersonalInfo" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "studentId" TEXT,
    "professorId" TEXT,

    CONSTRAINT "PersonalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_email_key" ON "PersonalInfo"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_personalInfoId_key" ON "Professor"("personalInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_personalInfoId_key" ON "Student"("personalInfoId");

-- AddForeignKey
ALTER TABLE "PersonalInfo" ADD CONSTRAINT "PersonalInfo_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_personalInfoId_fkey" FOREIGN KEY ("personalInfoId") REFERENCES "PersonalInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_personalInfoId_fkey" FOREIGN KEY ("personalInfoId") REFERENCES "PersonalInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
