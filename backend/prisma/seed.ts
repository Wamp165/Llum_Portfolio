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
      bio: "Photographer based in Gdanks, Poland.",
      contactEmail: "basiuzuza@gmail.com",
      instagram: "toiyashi",
      location: "Open to work anywhere in Europe and beyond.",
      substack: "toiyashi.substack.com",
      homeBanner: "https://res.cloudinary.com/dt0qtsury/image/upload/v1766251265/_8310282_1-kopia_hzncut.jpg",
      profilePicture: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767026793/IMG_1083_dcvr8s.jpg",
    },
  });

  await prisma.category.createMany({
    data: [
      { id: 1, name: "Projects", slug: "projects", userId:1, order: 1},
      { id: 2, name: "Stories", slug: "stories", userId: 1, order: 2},
      { id: 3, name: "Commercial", slug: "commercial", userId: 1, order: 3},
    ],
    skipDuplicates: true,
  });

  await prisma.work.createMany({
    data: [
      { title: "My little war", categoryId: 1, order: 1, date: "Started 2025 - ongoing", banner: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767025473/main_foto_wpw34i.jpg", description: "This project was born when I was beginning my little war against social media. I arrived in Reine, Norway (Lofoten) in August 2025 and what I noticed here made me think…", introduction: "This project was born when I was beginning my little war against social media. I arrived in Reine, Norway (Lofoten) in August 2025 and what I noticed here made me think…\n\nDoes the phrase \"Travel broadens the mind\" still mean something? Didn’t we give away all experiences for likes and views? Do they still broaden our minds?\n\nFrom what I see, I’m scared to admit they don’t anymore. They have become \"trends\" to be visible and likeable on the internet. We don’t talk about what we have seen, we talk about \"Instagram spots\". We don’t discover anymore, everything we have to know is already served on the little phone in our pocket. We will just check \"top 5 places you have to visit in… \", then we will check how everything looks so it won’t be a waste of time. We will create a new folder on Pinterest, to take just the same photo as someone also took. \nSo in the end we know everything about the place before even leaving our houses and we will come back with the same \"memories\" as the same 100 000 people before us. \n\nWe go up the mountains in make-up, wearing the best sports clothes and then we still will correct pictures of us with filters. We will create a fake view, make it more spectacular. ‘A little higher contrast, and maybe I will change the sky color to pink..’. We will make everything to show off in front of our followers. \n\nIt gives us a temporary dopamine rush. A moment of excitement when you see your picture is getting more and more likes. New followers, a comment, DM and then… You are not \"trending\" anymore. You have to change your personality, you have to adapt to what is \"viral\" again.\n\nWe live in a time when we take more pictures than our phones can carry and yet, we don’t remember any of them…We live in a time of likes, not experiences… We live in the time when travel no longer broadens the mind."},
      { title: "My little war 2", categoryId: 1, order: 2, date: "Started 2025 - ongoing", banner: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767025473/main_foto_wpw34i.jpg", description: "This project was born when I was beginning my little war against social media. I arrived in Reine, Norway (Lofoten) in August 2025 and what I noticed here made me think…", introduction: "This project was born when I was beginning my little war against social media. I arrived in Reine, Norway (Lofoten) in August 2025 and what I noticed here made me think…"},
      { title: "Self-Reflection", categoryId: 2, order: 1, date: "August 2025",description: "I don't know what I want to say here yet. It won’t be long though "},
    ],
    skipDuplicates: true,
  });

  await prisma.workSection.createMany({
    data: [
      { workId: 1, type: "IMAGE_ONLY", order: 1},
      { workId: 1, type: "IMAGE_ONLY", order: 2},
      { workId: 2, type: "IMAGE_LEFT_TEXT_RIGHT", order: 1, text: "Does the phrase “Travel broadens the mind” still mean something? Didn’t we give away all experiences for likes and views? Do they still broaden our minds?" },
      { workId: 2, type: "IMAGE_RIGHT_TEXT_LEFT", order: 2, text: "Does the phrase “Travel broadens the mind” still mean something? Didn’t we give away all experiences for likes and views? Do they still broaden our minds?" },
      { workId: 2, type: "IMAGE_ONLY", order: 3 },
      { workId: 2, type: "IMAGE_ONLY", order: 4 },
      { workId: 2, type: "IMAGE_CENTER_TEXT_BELOW", order: 5, text: "Does the phrase “Travel broadens the mind” still mean something? Didn’t we give away all experiences for likes and views? Do they still broaden our minds?" },
      { workId: 3, type: "IMAGE_ONLY", order: 1},
      { workId: 3, type: "IMAGE_ONLY", order: 2},
      { workId: 3, type: "IMAGE_ONLY", order: 3},
    ],
    skipDuplicates: true,
  });
  await prisma.workSectionImage.createMany({
    data: [
      {workSectionId: 1, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767025484/_8310222_cwrtev.jpg", order: 0},
      {workSectionId: 2, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767025480/_9060074_o8vo4l.jpg", order: 0},
      {workSectionId: 3, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767025484/_8310222_cwrtev.jpg", order: 0},
      {workSectionId: 4, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767025484/_8310222_cwrtev.jpg", order: 0},
      {workSectionId: 5, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767026206/1foto_wqzh5z.jpg", order: 1},
      {workSectionId: 5, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767026207/3foto_1_l3ow6b.jpg", order: 2},
      {workSectionId: 5, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767026208/2foto_1_elap1p.jpg", order: 3},
      {workSectionId: 6, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767025480/_9060074_o8vo4l.jpg", order: 1},
      {workSectionId: 6, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767025484/_8310222_cwrtev.jpg", order: 2},
      {workSectionId: 7, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767025473/main_foto_wpw34i.jpg", order: 0},
      {workSectionId: 8, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767026206/1foto_wqzh5z.jpg", order: 0},
      {workSectionId: 9, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767026207/3foto_1_l3ow6b.jpg", order: 0},
      {workSectionId: 10, imageUrl: "https://res.cloudinary.com/dt0qtsury/image/upload/v1767026208/2foto_1_elap1p.jpg", order: 0},
    ],
    skipDuplicates: true,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
