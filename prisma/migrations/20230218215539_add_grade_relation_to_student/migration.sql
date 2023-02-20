-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
