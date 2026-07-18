import { prisma } from "@/app/src/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

// 문예지 팔레트 기반 장르 태그 (파스텔 대신 톤 통일 · 채움으로 가독성 강화)
const GENRE_STYLES: Record<string, string> = {
  기획: "border-brass/30 bg-brass/12 text-brass",
  시스템: "border-pine/25 bg-pine/12 text-pine",
  사람: "border-moss/30 bg-moss/15 text-moss",
  기타: "border-ink/15 bg-ink/[0.05] text-ink/55",
};

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { startDate: "desc" },
    include: {
      _count: { select: { reviews: true } },
    },
  });

  const now = new Date();
  const isReading = (b: (typeof books)[number]) =>
    !!b.startDate && b.startDate <= now && (!b.endDate || b.endDate >= now);

  const totalReviews = books.reduce((sum, b) => sum + b._count.reviews, 0);

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-6 pb-24">
        {/* ── 마스트헤드 ─────────────────────────── */}
        <header className="pt-16 pb-10">
          <p className="animate-float-up font-display text-[0.7rem] uppercase tracking-[0.32em] text-moss">
            AndN · Library
          </p>
          <h1 className="animate-float-up delay-1 mt-5 font-serif text-5xl leading-[1.05] text-ink sm:text-6xl">
            함께 읽은 책
          </h1>
          <p className="animate-float-up delay-2 whitespace-nowrap mt-5 max-w-md text-[0.95rem] leading-relaxed text-ink/55">
            우리가 함께 펼친 {books.length}권의 기록. 표지를 눌러 각 책의
            감상으로 들어가 보세요.
          </p>

          <div className="animate-float-up delay-2 mt-8 flex items-center gap-8 border-t border-ink/15 pt-4 font-display text-[0.72rem] uppercase tracking-[0.2em] text-ink/45">
            <span>{books.length} Volumes</span>
            <span>{totalReviews} Reviews</span>
          </div>
        </header>

        {/* ── 목록 ───────────────────────────────── */}
        {books.length === 0 ? (
          <div className="border-t border-ink/10 py-24 text-center">
            <p className="font-serif text-2xl text-ink/70">
              아직 등록된 책이 없어요.
            </p>
            <Link
              href="/admin"
              className="mt-3 inline-block font-display text-sm uppercase tracking-[0.18em] text-moss transition-colors hover:text-pine"
            >
              첫 번째 책 등록하기 →
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {books.map((book, i) => {
              const reading = isReading(book);
              return (
                <li key={book.id}>
                  <Link
                    href={`/books/${book.id}`}
                    className="animate-float-up group block"
                    style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}
                  >
                    {/* 표지 */}
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm border border-ink/10 bg-paper-deep shadow-[0_18px_40px_-26px_rgba(27,38,32,0.55)] transition-transform duration-300 group-hover:-translate-y-1.5">
                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl}
                          alt={book.title}
                          fill
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center font-display text-4xl italic text-ink/20">
                          {book.title.charAt(0)}
                        </span>
                      )}

                      {reading && (
                        <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full border border-pine/20 bg-paper/85 px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-[0.14em] text-pine backdrop-blur-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-pine" />
                          읽는 중
                        </span>
                      )}
                    </div>

                    {/* 정보 */}
                    <div className="mt-3.5">
                      <h3 className="line-clamp-2 font-serif text-[0.98rem] leading-snug text-ink transition-colors group-hover:text-pine">
                        {book.title}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-ink/45">
                        {book.author}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between">
                        {book.genre ? (
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[0.72rem] font-medium ${
                              GENRE_STYLES[book.genre] ??
                              "border-ink/15 bg-ink/[0.05] text-ink/55"
                            }`}
                          >
                            {book.genre}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="text-[0.72rem] font-medium text-ink/60">
                          감상 {book._count.reviews}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
