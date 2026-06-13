import Image from "next/image";
import Link from "next/link";

const INDEX = [
  {
    href: "/books",
    label: "Library",
    title: "책 목록",
    description: "함께 읽은 책과 감상",
  },
  {
    href: "/calendar",
    label: "Calendar",
    title: "캘린더",
    description: "월별 독서의 흐름",
  },
  {
    href: "/stats",
    label: "Statistics",
    title: "통계",
    description: "카테고리·감상 현황",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6">
        {/* ── 마스트헤드 (시그니처) ───────────────── */}
        <section className="pt-16 pb-10">
          <p className="animate-float-up font-display text-[0.7rem] uppercase tracking-[0.32em] text-moss">
            AndN · Reading Club · Est. 2025
          </p>

          <h1
            className="animate-float-up delay-1 mt-6 font-serif text-5xl sm:text-6xl leading-[1.05] text-ink"
          >
            함께 읽고,
            <br />
            <em className="font-display italic font-normal text-pine">
              나누는
            </em>{" "}
            시간.
          </h1>

          <p className="animate-float-up delay-2 mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink/60">
            한 권의 책을 함께 펼치고, 페이지 사이에서 만난 생각을 나눕니다.
            우리가 지나온 독서의 기록을 둘러보세요.
          </p>

          {/* 초록 배지 — 유지 필수 */}
          <div className="animate-float-up delay-2 mt-7">
            <span className="inline-flex items-center gap-2 border border-pine/20 bg-pine/[0.06] text-pine text-xs px-3.5 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-pine" />
                <span className="live-dot relative inline-flex h-2 w-2 rounded-full bg-pine" />
              </span>
              2025년부터 함께 읽고 있어요
            </span>
          </div>
        </section>

        {/* ── 에디토리얼 플레이트 ─────────────────── */}
        <section className="animate-float-up delay-2 pb-14">
          <figure className="relative overflow-hidden rounded-sm border border-ink/10 shadow-[0_24px_60px_-30px_rgba(27,38,32,0.55)]">
            <Image
              src="/hero.png"
              alt="AndN 북클럽 — The Infinite Connection Book Club"
              width={1024}
              height={356}
              priority
              quality={95}
              sizes="(max-width: 768px) 100vw, 672px"
              className="w-full aspect-[1024/356] object-cover"
            />
            <figcaption className="flex items-center justify-between border-t border-ink/10 bg-paper px-4 py-2.5 font-display text-[0.7rem] uppercase tracking-[0.22em] text-ink/45">
              <span>Selected Readings</span>
              <span>No. 01</span>
            </figcaption>
          </figure>
        </section>

        {/* ── 인덱스 ─────────────────────────────── */}
        <section className="pb-10">
          <p className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-ink/40 pb-2 border-b border-ink/15">
            Index
          </p>
          <ul>
            {INDEX.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-baseline gap-5 border-b border-ink/10 py-5 transition-colors hover:bg-ink/[0.025]"
                >
                  <span className="w-24 shrink-0 font-display text-[0.72rem] uppercase tracking-[0.18em] text-moss">
                    {item.label}
                  </span>
                  <span className="flex-1">
                    <span
                      className="block font-serif text-xl text-ink transition-colors group-hover:text-pine"
                    >
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink/50">
                      {item.description}
                    </span>
                  </span>
                  <span className="self-center text-ink/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-pine">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── CTA ───────────────────────────────── */}
        <section className="pb-20">
          <Link
            href="/books"
            className="group relative block overflow-hidden rounded-sm bg-pine px-7 py-8 text-paper transition-shadow hover:shadow-[0_24px_50px_-24px_rgba(31,92,61,0.7)]"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-paper/60">
                  Start Here
                </p>
                <h2
                  className="mt-2 font-serif text-2xl text-paper"
                >
                  함께 읽은 책 보기
                </h2>
                <p className="mt-1 text-sm text-paper/70">
                  책별 감상과 카테고리를 한 자리에서.
                </p>
              </div>
              <span className="font-display text-3xl text-paper/80 transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
