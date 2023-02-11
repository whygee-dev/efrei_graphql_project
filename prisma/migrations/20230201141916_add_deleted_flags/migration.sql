/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Student` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "GenericCourse" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "deletedAt",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "deletedAt",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_genericCourseId_fkey" FOREIGN KEY ("genericCourseId") REFERENCES "GenericCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
