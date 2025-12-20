import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      id: 1,
      name: "Zuzanna Basiukiewicz",
      email,
      passwordHash,
      bio: "Photographer based in Warsaw, Poland.",
      contactEmail: "basiutestemail@gmail.com",
      instagram: "toiyashi",
      location: "Warsaw, Poland",
      substack: "https://basiu.substack.com/",
    },
  });

  await prisma.category.createMany({
    data: [
      { id: 1,name: "Proyectos", slug: "proyectos", order: 1, description: "Proyectos description" },
      { id: 2,name: "Stories", slug: "stories", order: 2, description: "Stories description" },
      { id: 3,name: "Commercial", slug: "commercial", order: 3, description: "Commercial description" },
    ],
    skipDuplicates: true,
  });

  await prisma.work.createMany({
    data: [
      { id: 1, title: "Lofoten", userId: 1, categoryId: 1, order: 1, description: "Lofoten"},
      { id: 2, title: "Selfportrait", userId: 1, categoryId: 2, order: 1, description: "Selfportrait"},
      { id: 3, title: "Reflection", userId: 1, categoryId: 2, order: 2, description: "Reflection"},
    ],
    skipDuplicates: true,
  });

  await prisma.workSection.createMany({
    data: [
      { id: 1, workId: 1, type: "IMAGE_LEFT_TEXT_RIGHT", order: 1, text: "Lofoten Text" },
      { id: 2, workId: 1, type: "IMAGE_RIGHT_TEXT_LEFT", order: 2, text: "Lofoten Text 2" },
      { id: 3, workId: 1, type: "IMAGE_CENTER_TEXT_BELOW", order: 3, text: "Lofoten Text 3" },
      { id: 4, workId: 1, type: "IMAGE_ONLY", order: 4},
      { id: 5, workId: 1, type: "TEXT_ONLY", order: 5, text: "Lofoten Text 5" },
      { id: 6, workId: 1, type: "IMAGE_ONLY", order: 6 },
      { id: 7, workId: 1, type: "IMAGE_ONLY", order: 7},
    ],
    skipDuplicates: true,
  });
  await prisma.workSectionImage.createMany({
    data: [
      {id: 1, workSectionId: 1, imageUrl: "", order: 0},
      {id: 2, workSectionId: 2, imageUrl: "", order: 0},
      {id: 3, workSectionId: 3, imageUrl: "", order: 0},
      {id: 4, workSectionId: 4, imageUrl: "", order: 0},
      {id: 5, workSectionId: 6, imageUrl: "", order: 1},
      {id: 6, workSectionId: 6, imageUrl: "", order: 2},
      {id: 7, workSectionId: 6, imageUrl: "", order: 3},
      {id: 8, workSectionId: 7, imageUrl: "", order: 1},
      {id: 9, workSectionId: 7, imageUrl: "", order: 2},
    ],
    skipDuplicates: true,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
