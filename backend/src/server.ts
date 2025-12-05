import app from "./app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = 4000;

async function start() {
  await prisma.$connect();
  console.log("Connected to PostgreSQL 🎉");

  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

start();