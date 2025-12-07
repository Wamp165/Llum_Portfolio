import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Zuzanna Basiukiewicz",
      slug: "zuzanna",
      homeBanner: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765117248/_8310282_1-kopia_mllko3.jpg"
    }
  });

  console.log("Seed completed.");
}

main();