/*
  Warnings:

  - Added the required column `buildingId` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "buildingId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Building" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
