import { prisma } from "@/app/src/lib/prisma";

export const dynamic = "force-dynamic";

// 장르별 팔레트 (책 목록·상세와 동일 매핑)
const GENRE_BAR: Record<string, string> = {
    기획: "bg-brass",
    시스템: "bg-pine",
    사람: "bg-moss",
    기타: "bg-ink/40",
};

export default async function StatsPage() {
    const [books, reviews, members] = await Promise.all([
        prisma.book.findMany({ orderBy: { startDate: "asc" } }),
        prisma.review.findMany(),
        prisma.member.findMany({
            include: { _count: { select: { reviews: true } } },
            orderBy: { id: "asc" },
        }),
    ]);

    // 장르 분포
    const genreCount: Record<string, number> = {};
    for (const book of books) {
        const genre = book.genre || "기타";
        genreCount[genre] = (genreCount[genre] || 0) + 1;
    }
    const genreEntries = Object.entries(genreCount).sort(([, a], [, b]) => b - a);
    const maxGenre = Math.max(...genreEntries.map(([, v]) => v), 1);

    // 월별 독서 현황
    const monthlyCount: Record<string, number> = {};
    for (const book of books) {
        if (!book.startDate) continue;
        const key = `${book.startDate.getFullYear()}.${String(book.startDate.getMonth() + 1).padStart(2, "0")}`;
        monthlyCount[key] = (monthlyCount[key] || 0) + 1;
    }
    const monthlyEntries = Object.entries(monthlyCount).sort();
    const maxMonthly = Math.max(...monthlyEntries.map(([, v]) => v), 1);

    // 평균 별점
    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : "—";

    const summaryCards = [
        { label: "Volumes", sub: "총 독서 권수", value: `${books.length}`, unit: "권" },
        { label: "Reviews", sub: "총 감상 수", value: `${reviews.length}`, unit: "개" },
        { label: "Avg. Rating", sub: "평균 별점", value: avgRating, unit: avgRating === "—" ? "" : "점" },
        { label: "Members", sub: "멤버 수", value: `${members.length}`, unit: "명" },
    ];

    const rankedMembers = [...members].sort((a, b) => b._count.reviews - a._count.reviews);
    const maxReviews = Math.max(...members.map((m) => m._count.reviews), 1);

    return (
        <div className="min-h-screen bg-paper">
            <div className="mx-auto max-w-4xl px-6 pb-24 pt-16">
                {/* ── 마스트헤드 ─────────────────────── */}
                <header className="pb-10">
                    <p className="animate-float-up font-display text-[0.7rem] uppercase tracking-[0.32em] text-moss">
                        AndN · Statistics
                    </p>
                    <h1 className="animate-float-up delay-1 mt-5 font-serif text-5xl leading-[1.05] text-ink sm:text-6xl">
                        통계
                    </h1>
                </header>

                {/* ── 요약 타일 ──────────────────────── */}
                <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {summaryCards.map((card, i) => (
                        <div
                            key={card.label}
                            className="animate-float-up rounded-sm border border-ink/10 bg-paper/50 p-5 shadow-[0_18px_44px_-32px_rgba(27,38,32,0.5)]"
                            style={{ animationDelay: `${0.05 * i}s` }}
                        >
                            <p className="font-display text-[0.64rem] uppercase tracking-[0.18em] text-moss">
                                {card.label}
                            </p>
                            <p className="mt-3 font-serif text-4xl leading-none text-ink">
                                {card.value}
                                <span className="ml-0.5 text-lg text-ink/45">{card.unit}</span>
                            </p>
                            <p className="mt-2 text-xs text-ink/45">{card.sub}</p>
                        </div>
                    ))}
                </section>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* ── 장르 분포 ──────────────────── */}
                    <section className="rounded-sm border border-ink/10 bg-paper/50 p-6 shadow-[0_18px_44px_-32px_rgba(27,38,32,0.5)]">
                        <h2 className="border-b border-ink/15 pb-2 font-display text-[0.7rem] uppercase tracking-[0.24em] text-ink/45">
                            장르 분포
                        </h2>
                        {genreEntries.length === 0 ? (
                            <p className="pt-4 text-sm text-ink/40">데이터 없음</p>
                        ) : (
                            <div className="mt-5 space-y-4">
                                {genreEntries.map(([genre, count]) => (
                                    <div key={genre}>
                                        <div className="mb-1.5 flex items-baseline justify-between text-sm">
                                            <span className="font-serif text-ink">{genre}</span>
                                            <span className="text-ink/50">{count}권</span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
                                            <div
                                                className={`h-full rounded-full ${GENRE_BAR[genre] ?? "bg-ink/40"}`}
                                                style={{ width: `${(count / maxGenre) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── 월별 추이 ──────────────────── */}
                    <section className="rounded-sm border border-ink/10 bg-paper/50 p-6 shadow-[0_18px_44px_-32px_rgba(27,38,32,0.5)]">
                        <h2 className="border-b border-ink/15 pb-2 font-display text-[0.7rem] uppercase tracking-[0.24em] text-ink/45">
                            월별 독서 현황
                        </h2>
                        {monthlyEntries.length === 0 ? (
                            <p className="pt-4 text-sm text-ink/40">데이터 없음</p>
                        ) : (
                            <div className="mt-5 flex h-28 items-end gap-2">
                                {monthlyEntries.map(([month, count]) => (
                                    <div key={month} className="flex flex-1 flex-col items-center gap-1.5">
                                        <span className="text-xs font-medium text-ink/55">{count}</span>
                                        <div
                                            className="w-full rounded-t-[2px] bg-pine/85"
                                            style={{ height: `${(count / maxMonthly) * 72}px`, minHeight: "4px" }}
                                        />
                                        <span className="font-display text-[0.62rem] text-ink/40">
                                            {month.split(".")[1]}월
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* ── 멤버별 감상 순위 ───────────────── */}
                <section className="mt-6 rounded-sm border border-ink/10 bg-paper/50 p-6 shadow-[0_18px_44px_-32px_rgba(27,38,32,0.5)]">
                    <h2 className="border-b border-ink/15 pb-2 font-display text-[0.7rem] uppercase tracking-[0.24em] text-ink/45">
                        멤버별 감상 수
                    </h2>
                    <ul className="mt-5 space-y-4">
                        {rankedMembers.map((member) => (
                            <li key={member.id} className="flex items-center gap-4">
                                <span
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                    style={{ backgroundColor: member.color }}
                                >
                                    {member.name[0]}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1.5 flex items-baseline justify-between">
                                        <span className="font-serif text-[0.95rem] text-ink">{member.name}</span>
                                        <span className="text-sm text-ink/50">감상 {member._count.reviews}</span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(member._count.reviews / maxReviews) * 100}%`,
                                                backgroundColor: member.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
