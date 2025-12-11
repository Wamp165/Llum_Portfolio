-- CreateEnum
CREATE TYPE "Category" AS ENUM ('PROJECT', 'STORY', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "WorkSectionType" AS ENUM ('IMAGE_LEFT_TEXT_RIGHT', 'IMAGE_RIGHT_TEXT_LEFT', 'IMAGE_CENTER', 'TEXT_ONLY', 'IMAGE_ONLY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "homeBanner" TEXT,
    "profilePicture" TEXT,
    "email" TEXT,
    "instagram" TEXT,
    "substack" TEXT,
    "location" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "banner" TEXT,
    "category" "Category" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
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

-- CreateIndex
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSection" ADD CONSTRAINT "WorkSection_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
