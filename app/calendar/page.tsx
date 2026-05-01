import { prisma } from "@/app/src/lib/prisma";
import Link from "next/link";

const MONTH_NAMES = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

export default async function CalendarPage() {
    const books = await prisma.book.findMany({
        where: { startDate: { not: null } },
        orderBy: { startDate: "asc" },
        include: { _count: { select: { reviews: true } } },
    });

    // 시작월 기준으로 그룹핑
    const monthMap = new Map<string, typeof books>();
    for (const book of books) {
        if (!book.startDate) continue;
        const key = `${book.startDate.getFullYear()}-${String(book.startDate.getMonth() + 1).padStart(2, "0")}`;
        if (!monthMap.has(key)) monthMap.set(key, []);
        monthMap.get(key)!.push(book);
    }
    const months = Array.from(monthMap.entries()).sort(([a], [b]) => b.localeCompare(a));

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-6">독서 캘린더</h1>

            {months.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-5xl mb-4">📅</p>
                    <p className="text-sm">날짜가 등록된 책이 없어요.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {months.map(([key, monthBooks]) => {
                        const [year, month] = key.split("-").map(Number);
                        return (
                            <div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="bg-emerald-600 text-white px-5 py-3 flex items-center justify-between">
                                    <h2 className="font-semibold text-sm">
                                        {year}년 {MONTH_NAMES[month - 1]}
                                    </h2>
                                    <span className="text-emerald-200 text-xs">{monthBooks.length}권</span>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {monthBooks.map((book) => (
                                        <Link
                                            key={book.id}
                                            href={`/books/${book.id}`}
                                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="text-xl">📖</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                                                    {book.title}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {book.author}
                                                    {book.genre && ` · ${book.genre}`}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-xs text-gray-400">
                                                    {book.startDate?.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}
                                                    {" ~ "}
                                                    {book.endDate?.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}
                                                </p>
                                                <p className="text-xs text-gray-300 mt-0.5">감상 {book._count.reviews}개</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
