/*
  Warnings:

  - Added the required column `groupId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "groupId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "curriculumId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_curriculumId_key" ON "Group"("name", "curriculumId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
