-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('PROJECT', 'SERIE', 'COMMERCIAL');
ALTER TABLE "Work" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;
