import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/app/src/lib/prisma";

export const dynamic = "force-dynamic";

const INDEX = [
  {
    href: "/books",
    no: "01",
    label: "Library",
    title: "책 목록",
    description: "함께 읽은 책과 감상을 한자리에서",
  },
  {
    href: "/calendar",
    no: "02",
    label: "Calendar",
    title: "캘린더",
    description: "월별로 흐르는 독서의 리듬",
  },
  {
    href: "/stats",
    no: "03",
    label: "Statistics",
    title: "통계",
    description: "카테고리와 감상의 현황",
  },
];

const DAY = 1000 * 60 * 60 * 24;

async function getData() {
  const now = new Date();

  const current = await prisma.book.findFirst({
    where: {
      startDate: { lte: now },
      OR: [{ endDate: null }, { endDate: { gte: now } }],
    },
    orderBy: { startDate: "desc" },
    include: { _count: { select: { reviews: true } } },
  });

  const book =
    current ??
    (await prisma.book.findFirst({
      orderBy: { startDate: "desc" },
      include: { _count: { select: { reviews: true } } },
    }));

  const recent = await prisma.book.findMany({
    orderBy: { startDate: "desc" },
    take: 9,
    select: { id: true, title: true, author: true, coverUrl: true },
  });

  const featured = book
    ? {
        book,
        isReading: Boolean(current),
        days:
          current && book.startDate
            ? Math.max(
                1,
                Math.floor((now.getTime() - book.startDate.getTime()) / DAY) + 1
              )
            : null,
      }
    : null;

  const shelf = recent.filter((b) => b.id !== book?.id).slice(0, 8);

  return { featured, shelf };
}

export default async function HomePage() {
  const { featured, shelf } = await getData();

  return (
    <div className="bg-paper">
      {/* ═══ HERO — 딥 파인 매거진 마스트헤드 ═══════════════ */}
      <section className="relative overflow-hidden bg-pine text-paper">
        {/* 워터마크 넘버럴 */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -bottom-16 hidden select-none font-display text-[16rem] italic leading-none text-paper/[0.06] sm:block"
        >
          ’25
        </span>

        <div className="relative mx-auto max-w-5xl px-6 pt-16 pb-14 sm:pt-20 sm:pb-16">
          {/* 이슈 메타 라인 */}
          <div className="animate-float-up flex items-center justify-between border-b border-paper/20 pb-4 font-display text-[0.7rem] uppercase tracking-[0.28em] text-paper/60">
            <span>AndN · Reading Club</span>
            <span>Vol. 2025 —</span>
          </div>

          {/* 초록 배지 — 유지 필수 (파인 배경용) */}
          <div className="animate-float-up delay-1 mt-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-paper/25 bg-paper/10 px-3.5 py-1.5 text-xs text-paper">
              <span className="relative flex h-2 w-2">
                <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-paper" />
                <span className="live-dot relative inline-flex h-2 w-2 rounded-full bg-paper" />
              </span>
              2025년부터 함께 읽고 있어요
            </span>
          </div>

          {/* 초대형 타이틀 */}
          <h1 className="animate-float-up delay-2 mt-7 font-serif text-6xl leading-[0.98] tracking-tight text-paper sm:text-7xl lg:text-8xl">
            함께 읽고,
            <br />
            <em className="font-display font-normal italic text-brass">
              나누는
            </em>{" "}
            시간.
          </h1>

          <p className="animate-float-up delay-3 mt-8 max-w-md text-[0.98rem] leading-relaxed text-paper/70">
            한 권의 책을 함께 펼치고, 페이지 사이에서 만난 생각을 나눕니다.
            우리가 지나온 독서의 기록을 둘러보세요.
          </p>
        </div>
      </section>

      {/* ═══ NOW READING — 대형 피처 ═══════════════════ */}
      {featured && (
        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <p className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-moss">
            {featured.isReading ? "Now Reading — 지금 함께 읽는 책" : "Latest Read — 가장 최근에 읽은 책"}
          </p>

          <div className="mt-8 grid items-center gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14">
            {/* 표지 */}
            <Link href={`/books/${featured.book.id}`} className="group block">
              <div className="relative mx-auto aspect-[2/3] w-52 overflow-hidden rounded-sm border border-ink/10 bg-paper-deep shadow-[0_40px_80px_-30px_rgba(27,38,32,0.6)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[-1.5deg] sm:w-64 md:mx-0">
                {featured.book.coverUrl ? (
                  <Image
                    src={featured.book.coverUrl}
                    alt={featured.book.title}
                    fill
                    sizes="(max-width: 768px) 16rem, 16rem"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-display text-4xl italic text-ink/20">
                    A
                  </span>
                )}
              </div>
            </Link>

            {/* 내용 */}
            <div>
              <div className="flex items-center gap-3">
                {featured.isReading ? (
                  <span className="inline-flex items-center gap-1.5 font-display text-[0.7rem] uppercase tracking-[0.18em] text-pine">
                    <span className="h-1.5 w-1.5 rounded-full bg-pine" />
                    읽는 중
                  </span>
                ) : (
                  <span className="font-display text-[0.7rem] uppercase tracking-[0.18em] text-moss">
                    완독
                  </span>
                )}
                {featured.book.genre && (
                  <span className="rounded-full border border-moss/25 px-2.5 py-0.5 text-[0.7rem] text-moss">
                    {featured.book.genre}
                  </span>
                )}
              </div>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
                {featured.book.title}
              </h2>
              <p className="mt-3 text-base text-ink/55">{featured.book.author}</p>

              <p className="mt-6 border-t border-ink/10 pt-6 text-sm text-ink/50">
                {featured.isReading && featured.days
                  ? `함께 읽은 지 ${featured.days}일째 · 감상 ${featured.book._count.reviews}편`
                  : `감상 ${featured.book._count.reviews}편`}
              </p>

              <Link
                href={`/books/${featured.book.id}`}
                className="group mt-7 inline-flex items-center gap-2 rounded-sm bg-pine px-5 py-3 text-sm text-paper transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(31,92,61,0.75)]"
              >
                이 책의 감상 보기
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ THE SHELF — 최근 서가 표지 스트립 ═══════════ */}
      {shelf.length > 0 && (
        <section className="border-y border-ink/10 bg-paper-deep/40 py-14">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-baseline justify-between border-b border-ink/15 pb-3">
              <p className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-ink/45">
                The Shelf — 최근 서가
              </p>
              <Link
                href="/books"
                className="font-display text-[0.7rem] uppercase tracking-[0.18em] text-moss transition-colors hover:text-pine"
              >
                전체 보기 →
              </Link>
            </div>

            <ul className="mt-8 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {shelf.map((b, i) => (
                <li key={b.id} className="shrink-0">
                  <Link
                    href={`/books/${b.id}`}
                    className="animate-float-up group block w-28 sm:w-32"
                    style={{ animationDelay: `${0.05 * i}s` }}
                  >
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm border border-ink/10 bg-paper shadow-[0_16px_36px_-24px_rgba(27,38,32,0.5)] transition-transform duration-300 group-hover:-translate-y-1.5">
                      {b.coverUrl ? (
                        <Image
                          src={b.coverUrl}
                          alt={b.title}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center font-display italic text-ink/20">
                          A
                        </span>
                      )}
                    </div>
                    <p className="mt-2.5 line-clamp-2 font-serif text-[0.82rem] leading-snug text-ink/80 transition-colors group-hover:text-pine">
                      {b.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ═══ CONTENTS — 매거진 목차형 인덱스 ════════════ */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <p className="border-b border-ink/15 pb-3 font-display text-[0.7rem] uppercase tracking-[0.28em] text-ink/45">
          Contents
        </p>
        <ul>
          {INDEX.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-center gap-6 border-b border-ink/10 py-7 transition-colors hover:bg-ink/[0.02] sm:gap-10"
              >
                <span className="font-display text-2xl italic text-ink/25 transition-colors group-hover:text-brass sm:text-3xl">
                  {item.no}
                </span>
                <div className="flex-1">
                  <span className="font-display text-[0.68rem] uppercase tracking-[0.2em] text-moss">
                    {item.label}
                  </span>
                  <span className="mt-1 block font-serif text-2xl text-ink transition-colors group-hover:text-pine sm:text-3xl">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm text-ink/50">
                    {item.description}
                  </span>
                </div>
                <span className="text-xl text-ink/30 transition-all duration-200 group-hover:translate-x-1.5 group-hover:text-pine">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══ CTA — 파인 클로징 밴드 ════════════════════ */}
      <section className="bg-pine text-paper">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-16 sm:flex-row sm:items-end sm:justify-between sm:py-20">
          <div>
            <p className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-paper/60">
              Start Here
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
              지금까지 함께 읽은
              <br />
              책들을 만나보세요.
            </h2>
          </div>
          <Link
            href="/books"
            className="group inline-flex items-center gap-2 rounded-sm bg-paper px-6 py-3.5 text-sm text-pine transition-transform hover:-translate-y-0.5"
          >
            책 목록 열기
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
