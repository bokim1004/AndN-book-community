import { prisma } from "@/app/src/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

function getProgress(startDate: Date, endDate: Date): number {
  const now = Date.now();
  const start = startDate.getTime();
  const end = endDate.getTime();
  return Math.min(
    100,
    Math.max(0, Math.round(((now - start) / (end - start)) * 100))
  );
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default async function HomePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalBooks,
    totalMembers,
    totalReviews,
    currentBook,
    recentBooks,
    nextMeeting,
  ] = await Promise.all([
    prisma.book.count(),
    prisma.member.count(),
    prisma.review.count(),
    prisma.book.findFirst({
      where: { startDate: { lte: today }, endDate: { gte: today } },
      orderBy: { startDate: "desc" },
    }),
    prisma.book.findMany({
      where: { endDate: { lt: today } },
      orderBy: { endDate: "desc" },
      take: 3,
    }),
    prisma.meeting.findFirst({
      where: { date: { gte: today } },
      orderBy: { date: "asc" },
      include: { book: { select: { title: true } } },
    }),
  ]);

  const featuredBook =
    currentBook ??
    (await prisma.book.findFirst({
      orderBy: { endDate: "desc" },
      where: { endDate: { not: null } },
    }));

  const progress =
    featuredBook?.startDate && featuredBook?.endDate
      ? getProgress(featuredBook.startDate, featuredBook.endDate)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* 히어로 */}
      <section className="relative px-6 pt-16 pb-14 text-center overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />

        <div className="relative max-w-lg mx-auto">
          {/* 배너 이미지 */}
          <div className="rounded-2xl overflow-hidden shadow-md mb-8">
            <img
              src="/bg_img.png"
              alt="AndN 북클럽"
              className="w-full object-cover"
            />
          </div>

          <p className="text-gray-500 text-base mb-10">
            책을 함께 읽고, 생각을 나누어요
          </p>

          {/* 함께 읽은 기간 배지 */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              2025년부터 함께 읽고 있습니다
            </span>
          </div>

          {/* 통계 */}
          <div className="flex justify-center items-center gap-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              { value: totalBooks, label: "읽은 책" },
              { value: totalMembers, label: "멤버" },
              { value: totalReviews, label: "감상 기록" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`flex-1 py-5 text-center ${
                  i < 2 ? "border-r border-gray-100" : ""
                }`}
              >
                <p className="text-2xl font-bold text-emerald-600">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 콘텐츠 */}
      <div className="max-w-xl mx-auto px-6 pb-16 space-y-8">
        {/* 지금 읽고 있는 책 */}
        {featuredBook && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {currentBook ? "지금 읽고 있는 책" : "가장 최근 읽은 책"}
              </span>
            </div>
            <Link href={`/books/${featuredBook.id}`} className="group block">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex gap-5">
                {featuredBook.coverUrl ? (
                  <img
                    src={featuredBook.coverUrl}
                    alt={featuredBook.title}
                    className="w-20 h-28 object-cover rounded-xl shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-28 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm text-3xl">
                    📚
                  </div>
                )}
                <div className="flex-1 min-w-0 py-1">
                  <p className="font-bold text-gray-900 text-lg leading-snug group-hover:text-emerald-700 transition-colors">
                    {featuredBook.title}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {featuredBook.author}
                  </p>
                  {featuredBook.genre && (
                    <span className="inline-block text-xs bg-emerald-50 text-emerald-700 font-medium px-2.5 py-0.5 rounded-full mt-2">
                      {featuredBook.genre}
                    </span>
                  )}
                  {featuredBook.startDate && featuredBook.endDate && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>
                          {featuredBook.startDate.toLocaleDateString("ko-KR", {
                            month: "numeric",
                            day: "numeric",
                          })}
                        </span>
                        <span className="font-medium text-emerald-600">
                          {progress}%
                        </span>
                        <span>
                          {featuredBook.endDate.toLocaleDateString("ko-KR", {
                            month: "numeric",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* 최근 읽은 책 */}
        {recentBooks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                최근 읽은 책
              </span>
              <Link
                href="/books"
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                전체 보기 →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {recentBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="group"
                >
                  <div className="relative">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full aspect-[2/3] object-cover rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 text-3xl border border-emerald-100">
                        📚
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-800 mt-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {book.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {book.author}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 다음 모임 */}
        {nextMeeting && (
          <section>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-3">
              다음 모임
            </span>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
              <div className="bg-emerald-600 rounded-xl px-4 py-3 text-center text-white flex-shrink-0 min-w-[64px]">
                <p className="text-[10px] font-medium opacity-75 uppercase tracking-wide">
                  {nextMeeting.date.toLocaleDateString("ko-KR", {
                    month: "long",
                  })}
                </p>
                <p className="text-3xl font-bold leading-none mt-1">
                  {nextMeeting.date.getDate()}
                </p>
                <p className="text-[10px] opacity-70 mt-1">
                  {DAYS[nextMeeting.date.getDay()]}요일
                </p>
              </div>
              <div className="flex-1 min-w-0">
                {nextMeeting.book && (
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {nextMeeting.book.title}
                  </p>
                )}
                {nextMeeting.location && (
                  <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                    <span>📍</span>
                    {nextMeeting.location}
                  </p>
                )}
                {nextMeeting.notes && (
                  <p className="text-gray-400 text-xs mt-1">
                    {nextMeeting.notes}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
