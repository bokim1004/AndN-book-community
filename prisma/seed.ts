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

async function main() {
  // 멤버 생성
  const members = await Promise.all(
    ["보경", "보라", "세정", "지은", "재숙", "진희", "원경", "수민"].map(
      (name, i) =>
        prisma.member.upsert({
          where: { id: i + 1 },
          update: {},
          create: { name, color: MEMBER_COLORS[i] },
        })
    )
  );

  // 샘플 책 등록
  const books = [
    {
      title: "작별인사",
      author: "김영하",
      genre: "소설",
      startDate: new Date("2025-01-06"),
      endDate: new Date("2025-01-31"),
    },
  ];

  for (const bookData of books) {
    const book = await prisma.book.create({ data: bookData });

    // 각 책에 모임 일정 생성
    await prisma.meeting.create({
      data: {
        bookId: book.id,
        date: bookData.endDate!,
        location: "스타벅스 강남점",
      },
    });

    // 랜덤 멤버 감상 생성
    const reviewMembers = members.slice(0, 4 + Math.floor(Math.random() * 4));
    for (const member of reviewMembers) {
      await prisma.review.create({
        data: {
          bookId: book.id,
          memberId: member.id,
          content: `${member.name}의 ${bookData.title} 감상입니다.`,
          rating: 3 + Math.floor(Math.random() * 3),
        },
      });
    }
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
