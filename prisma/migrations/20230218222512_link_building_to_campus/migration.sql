/*
  Warnings:

  - Added the required column `campusId` to the `Building` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "campusId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
