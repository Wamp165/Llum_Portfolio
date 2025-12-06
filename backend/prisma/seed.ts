import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Zuzanna",
      slug: "zuzanna"
    }
  });

  console.log("Seed completed.");
}

main();