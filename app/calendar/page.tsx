import CalendarView from "@/app/calendar/CalendarView";
import { prisma } from "@/app/src/lib/prisma";

export const revalidate = 60;

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
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">독서 캘린더</h1>

      {months.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-sm">날짜가 등록된 책이 없어요.</p>
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
  );
}
