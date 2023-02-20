/*
  Warnings:

  - Added the required column `birthDate` to the `PersonalInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonalInfo" ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL;
