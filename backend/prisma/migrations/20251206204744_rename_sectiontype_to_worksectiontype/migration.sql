/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WorkSectionType" AS ENUM ('IMAGE_LEFT_TEXT_RIGHT', 'IMAGE_RIGHT_TEXT_LEFT', 'IMAGE_CENTER', 'TEXT_ONLY', 'IMAGE_ONLY');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostSection" DROP CONSTRAINT "PostSection_postId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "PostSection";

-- DropEnum
DROP TYPE "SectionType";

-- CreateTable
CREATE TABLE "Work" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "banner" TEXT,
    "category" "Category" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSection" (
    "id" SERIAL NOT NULL,
    "type" "WorkSectionType" NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "order" INTEGER NOT NULL,
    "workId" INTEGER NOT NULL,

    CONSTRAINT "WorkSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSection" ADD CONSTRAINT "WorkSection_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
