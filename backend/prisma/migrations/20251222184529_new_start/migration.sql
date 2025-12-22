-- DropForeignKey
ALTER TABLE "WorkSection" DROP CONSTRAINT "WorkSection_workId_fkey";

-- DropForeignKey
ALTER TABLE "WorkSectionImage" DROP CONSTRAINT "WorkSectionImage_workSectionId_fkey";

-- AddForeignKey
ALTER TABLE "WorkSection" ADD CONSTRAINT "WorkSection_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSectionImage" ADD CONSTRAINT "WorkSectionImage_workSectionId_fkey" FOREIGN KEY ("workSectionId") REFERENCES "WorkSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
