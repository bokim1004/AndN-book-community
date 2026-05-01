import { prisma } from "@/app/src/lib/prisma";

export const dynamic = "force-dynamic";

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
        { label: "총 독서 권수", value: `${books.length}권`, icon: "📚" },
        { label: "총 감상 수", value: `${reviews.length}개`, icon: "✍️" },
        { label: "평균 별점", value: avgRating === "—" ? avgRating : `${avgRating}점`, icon: "⭐" },
        { label: "멤버 수", value: `${members.length}명`, icon: "👥" },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-xl font-bold text-gray-900">통계 대시보드</h1>

            {/* 요약 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summaryCards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                        <p className="text-3xl mb-2">{card.icon}</p>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 장르 분포 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4 text-sm">장르 분포</h2>
                    {genreEntries.length === 0 ? (
                        <p className="text-sm text-gray-400">데이터 없음</p>
                    ) : (
                        <div className="space-y-3">
                            {genreEntries.map(([genre, count]) => (
                                <div key={genre}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-700">{genre}</span>
                                        <span className="text-gray-500 font-medium">{count}권</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${(count / maxGenre) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 월별 추이 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4 text-sm">월별 독서 현황</h2>
                    {monthlyEntries.length === 0 ? (
                        <p className="text-sm text-gray-400">데이터 없음</p>
                    ) : (
                        <div className="flex items-end gap-2 h-28">
                            {monthlyEntries.map(([month, count]) => (
                                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-xs text-gray-600 font-medium">{count}</span>
                                    <div
                                        className="w-full bg-emerald-500 rounded-t-sm"
                                        style={{ height: `${(count / maxMonthly) * 72}px`, minHeight: "4px" }}
                                    />
                                    <span className="text-xs text-gray-400">{month.split(".")[1]}월</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 멤버별 감상 수 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4 text-sm">멤버별 감상 수</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {members
                        .sort((a, b) => b._count.reviews - a._count.reviews)
                        .map((member) => (
                            <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                    style={{ backgroundColor: member.color }}
                                >
                                    {member.name[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                    <p className="text-xs text-gray-400">{member._count.reviews}개</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
