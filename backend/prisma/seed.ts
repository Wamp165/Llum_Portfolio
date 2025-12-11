import { PrismaClient, Category, WorkSectionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Zuzanna Basiukiewicz",
      slug: "zuzanna",
      homeBanner: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765117248/_8310282_1-kopia_mllko3.jpg",
      profilePicture: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765460218/IMG_1083_mihsfp.jpg",
      email: "basiuzuza@gmail.com",
      instagram: "toiyashi",
      substack: "toiyashi.substack.com",
      bio: "Hi, I'm Zuzanna, a passionate photographer based in Poland. My journey into photography began several years ago, and since then, I've been captivated by the art of capturing moments that tell a story.",
      location: "Open to work anywhere in Europe and beyond.",
    },
  });

  await prisma.work.create({
    data: {
      title: "LOFOTEN",
      description: "Does the phrase “Travel broadens the mind” still mean something? Didn’t we give away all experiences for likes and views? Do they still broaden our minds?",
      banner: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765186287/main_foto_bxbfsc.jpg",
      category: Category.PROJECT,
      order: 1,
      userId: user.id,
    },
  });

  await prisma.work.create({
    data: {
      title: "Transition",
      description: "The series “transition” was created spontaneously. However, it reflects my all-time thoughts. The time which is nonstop passing, the part of when we were children, reckless. In which moment we gave away this innocent time for responsibilities, work.",
      banner: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765190204/1_Main_1_dacmwx.jpg",
      category: Category.STORY,
      order: 1,
      userId: user.id,
    },
  });

  await prisma.work.create({
    data: {
      title: "Self-reflection",
      description: "I don't know what I want to say here yet. It won’t be long though.",
      banner: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765186753/1foto_lqmqzj.jpg",
      category: Category.STORY,
      order: 2,
      userId: user.id,
    },
  });

  await prisma.workSection.create({
    data: {
      type: WorkSectionType.IMAGE_LEFT_TEXT_RIGHT,
      text: "We don’t discover anymore, everything we have to know is already served on the little phone in our pocket. We will just check “top 5 places you have to visit in… “, then we will check how everything looks so it won’t be a waste of time.",
      image: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765199245/_9060074_gcei0z.jpg",
      order: 1,
      work: { connect: { id: 1 } },
    },
  });

  await prisma.workSection.create({
    data: {
      type: WorkSectionType.IMAGE_RIGHT_TEXT_LEFT,
      text: "We go up the mountains in make-up, wearing the best sports clothes and then we still will correct pictures of us with filters. We will create a fake view, make it more spectacular.",
      image: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765199249/_8310222_ptmwfs.jpg",
      order: 2,
      work: { connect: { id: 1 } },
    },
  });

  await prisma.workSection.create({
    data: {
      type: WorkSectionType.IMAGE_LEFT_TEXT_RIGHT,
      text: "The series “transition” was created spontaneously. However, it reflects my all time thoughts.",
      image: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765199546/4foto_sndmrc.jpg",
      order: 1,
      work: { connect: { id: 2 } },
    },
  });

  await prisma.workSection.create({
    data: {
      type: WorkSectionType.IMAGE_RIGHT_TEXT_LEFT,
      text: "The time which is non stop passing, the part of when we were children, reckless.",
      image: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765199548/3foto_go5nwx.jpg",
      order: 2,
      work: { connect: { id: 2 } },
    },
  });

  await prisma.workSection.create({
    data: {
      type: WorkSectionType.IMAGE_CENTER,
      text: "In which moment we gave away these innocent time for responsibilities, work.",
      image: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765199549/2foto_j5p2db.jpg",
      order: 3,
      work: { connect: { id: 2 } },
    },
  });

  await prisma.workSection.create({
    data: {
      type: WorkSectionType.IMAGE_ONLY,
      image: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765199550/5foto_c2bmdb.jpg",
      order: 4,
      work: { connect: { id: 2 } },
    },
  });

  await prisma.workSection.create({
    data: {
      type: WorkSectionType.TEXT_ONLY,
      text: "This is a sample text, meant to test the only text field.",
      order: 5,
      work: { connect: { id: 2 } },
    },
  });

  await prisma.workSection.create({
    data: {
      type: WorkSectionType.IMAGE_LEFT_TEXT_RIGHT,
      text: "I don't know what I want to say here yet. It won’t be long though ",
      image: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765199854/2foto_1_dbmtgq.jpg",
      order: 1,
      work: { connect: { id: 3 } },
    },
  });

  await prisma.workSection.create({
    data: {
      type: WorkSectionType.IMAGE_ONLY,
      image: "https://res.cloudinary.com/dr2l0nou2/image/upload/v1765199851/3foto_1_abfxta.jpg",
      order: 2,
      work: { connect: { id: 3 } },
    },
  });

  console.log("Seed completed.");
}

main();
