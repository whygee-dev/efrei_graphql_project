/*
  Warnings:

  - Added the required column `campusId` to the `Classroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_addressId_fkey";

-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "campusId" TEXT NOT NULL,
ADD COLUMN     "floor" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Campus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "addressId" TEXT NOT NULL,

    CONSTRAINT "Campus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Campus" ADD CONSTRAINT "Campus_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
