import CalendarView from "@/app/calendar/CalendarView";
import { prisma } from "@/app/src/lib/prisma";

export const dynamic = "force-dynamic";

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function monthRange(start: Date, end: Date) {
  const months: string[] = [];
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
  const last = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));

  while (cursor <= last) {
    months.push(monthKey(cursor));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return months.reverse();
}

export default async function CalendarPage() {
  const books = await prisma.book.findMany({
    where: { startDate: { not: null } },
    orderBy: { startDate: "asc" },
    include: { _count: { select: { reviews: true } } },
  });

  const datedBooks = books.filter((book) => book.startDate);
  const starts = datedBooks.map((book) => book.startDate!);
  const ends = datedBooks.map((book) => book.endDate ?? book.startDate!);
  const months =
    datedBooks.length > 0
      ? monthRange(
          new Date(Math.min(...starts.map((date) => date.getTime()))),
          new Date(Math.max(...ends.map((date) => date.getTime())))
        )
      : [];

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-16">
        <header className="pb-8">
          <p className="animate-float-up font-display text-[0.7rem] uppercase tracking-[0.32em] text-moss">
            AndN · Calendar
          </p>
          <h1 className="animate-float-up delay-1 mt-5 font-serif text-5xl leading-[1.05] text-ink sm:text-6xl">
            독서 캘린더
          </h1>
          <p className="animate-float-up delay-2 mt-4 text-[0.95rem] text-ink/55">
            월별로 흐르는 우리의 독서 리듬을 따라가 보세요.
          </p>
        </header>

      {months.length === 0 ? (
        <div className="border-t border-ink/10 py-24 text-center">
          <p className="font-serif text-2xl text-ink/60">날짜가 등록된 책이 없어요.</p>
        </div>
      ) : (
        <CalendarView
          months={months}
          books={datedBooks.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            startDate: dateKey(book.startDate!),
            endDate: book.endDate ? dateKey(book.endDate) : null,
            reviewCount: book._count.reviews,
          }))}
        />
      )}
      </div>
    </div>
  );
}
