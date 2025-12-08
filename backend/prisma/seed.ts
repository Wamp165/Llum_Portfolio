import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Zuzanna Basiukiewicz",
      slug: "zuzanna",
      homeBanner:"https://res.cloudinary.com/dr2l0nou2/image/upload/v1765117248/_8310282_1-kopia_mllko3.jpg",
    },
  });

  await prisma.work.create({
    data: {
      title: "LOFOTEN",
      description: "Does the phrase “Travel broadens the mind” still mean something? Didn’t we give away all experiences for likes and views? Do they still broaden our minds?",
      banner: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765186287/main_foto_bxbfsc.jpg",
      category: Category.PROJECT,
      userId: user.id,
    },
  });

  await prisma.work.create({
    data: {
      title: "Transition",
      description: "The series “transition” was created spontaneously. However, it reflects my all-time thoughts. The time which is nonstop passing, the part of when we were children, reckless. In which moment we gave away this innocent time for responsibilities, work.",
      banner: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765186647/main_foto_mngz34.jpg",
      category: Category.STORY,
      userId: user.id,
    },
  });

  await prisma.work.create({
    data: {
      title: "Self-reflection",
      description: "I don't know what I want to say here yet. It won’t be long though.",
      banner: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765186753/1foto_lqmqzj.jpg",
      category: Category.STORY,
      userId: user.id,
    },
  });

  console.log("Seed completed.");
}

main();
