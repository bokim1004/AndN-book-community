import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MEMBER_COLORS = [
  "#534AB7", // purple
  "#1D9E75", // teal
  "#D85A30", // coral
  "#D4537E", // pink
  "#378ADD", // blue
  "#639922", // green
  "#BA7517", // amber
  "#E24B4A", // red
];

const MEMBERS = [
  "보경",
  "보라",
  "세정",
  "지은",
  "재숙",
  "진희",
  "원경",
  "수민",
];

async function main() {
  await prisma.$executeRaw`TRUNCATE TABLE reviews, meetings, books RESTART IDENTITY CASCADE`;

  // 멤버 생성
  await Promise.all(
    MEMBERS.map((name, i) =>
      prisma.member.upsert({
        where: { id: i + 1 },
        update: { name, color: MEMBER_COLORS[i] },
        create: { name, color: MEMBER_COLORS[i] },
      })
    )
  );

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
