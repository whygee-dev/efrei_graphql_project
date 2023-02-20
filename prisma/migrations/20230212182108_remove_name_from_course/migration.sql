/*
  Warnings:

  - You are about to drop the column `name` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `Grade` table. All the data in the column will be lost.
  - Added the required column `examId` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hourlyWage` to the `Professor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_studentId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "courseId",
ADD COLUMN     "examId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "hourlyWage" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
