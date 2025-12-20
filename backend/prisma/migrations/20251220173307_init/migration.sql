-- CreateEnum
CREATE TYPE "WorkSectionType" AS ENUM ('IMAGE_LEFT_TEXT_RIGHT', 'IMAGE_RIGHT_TEXT_LEFT', 'IMAGE_CENTER_TEXT_BELOW', 'TEXT_ONLY', 'IMAGE_ONLY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "bio" TEXT,
    "homeBanner" TEXT,
    "profilePicture" TEXT,
    "contactEmail" TEXT,
    "instagram" TEXT,
    "substack" TEXT,
    "location" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "banner" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSection" (
    "id" SERIAL NOT NULL,
    "type" "WorkSectionType" NOT NULL,
    "text" TEXT,
    "order" INTEGER NOT NULL,
    "workId" INTEGER NOT NULL,

    CONSTRAINT "WorkSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSectionImage" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "workSectionId" INTEGER NOT NULL,

    CONSTRAINT "WorkSectionImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSection" ADD CONSTRAINT "WorkSection_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSectionImage" ADD CONSTRAINT "WorkSectionImage_workSectionId_fkey" FOREIGN KEY ("workSectionId") REFERENCES "WorkSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
