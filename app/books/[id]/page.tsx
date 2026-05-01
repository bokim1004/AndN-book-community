import { prisma } from "@/app/src/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReviewForm from "./ReviewForm";

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const books = await prisma.book.findMany({ select: { id: true } });

    return books.map((book) => ({ id: book.id.toString() }));
}

export default async function BookDetailPage({ params }: Props) {
    const { id } = await params;
    const bookId = parseInt(id);
    if (isNaN(bookId)) notFound();

    const [book, members, reviews] = await Promise.all([
        prisma.book.findUnique({ where: { id: bookId }, include: { meeting: true } }),
        prisma.member.findMany({ orderBy: { id: "asc" } }),
        prisma.review.findMany({
            where: { bookId },
            include: { member: true },
            orderBy: { createdAt: "asc" },
        }),
    ]);

    if (!book) notFound();

    const reviewedMemberIds = reviews.map((r) => r.memberId);
    const avgRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* 책 정보 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex gap-5">
                {book.coverUrl ? (
                    <Image
                        src={book.coverUrl}
                        alt={book.title}
                        width={224}
                        height={320}
                        className="w-28 h-40 object-cover rounded-lg flex-shrink-0 shadow-sm"
                    />
                ) : (
                    <div className="w-28 h-40 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-4xl">📚</span>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-gray-900">{book.title}</h1>
                    <p className="text-gray-500 text-sm mt-1">{book.author}</p>
                    {book.genre && (
                        <span className="inline-block text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full mt-3">
                            {book.genre}
                        </span>
                    )}
                    {book.startDate && (
                        <p className="text-xs text-gray-400 mt-3">
                            {book.startDate.toLocaleDateString("ko-KR")} ~{" "}
                            {book.endDate?.toLocaleDateString("ko-KR")}
                        </p>
                    )}
                    {book.meeting && (
                        <p className="text-xs text-gray-500 mt-1">
                            📅 모임: {book.meeting.date.toLocaleDateString("ko-KR")}
                            {book.meeting.location && ` · ${book.meeting.location}`}
                        </p>
                    )}
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-1 mt-3">
                            <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(avgRating))}</span>
                            <span className="text-xs text-gray-400">
                                {avgRating.toFixed(1)} ({reviews.length}명)
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* 감상 목록 */}
            <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    멤버 감상 ({reviews.length})
                </h2>
                <div className="space-y-2">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-lg border border-gray-100 p-4 flex items-start gap-3"
                        >
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: review.member.color }}
                            >
                                {review.member.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm text-gray-900">
                                        {review.member.name}
                                    </span>
                                    <span className="text-xs text-yellow-400">
                                        {"★".repeat(review.rating)}
                                        <span className="text-gray-200">{"★".repeat(5 - review.rating)}</span>
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{review.content}</p>
                            </div>
                        </div>
                    ))}
                    {reviews.length === 0 && (
                        <p className="text-sm text-gray-400 py-2">
                            아직 감상이 없어요. 첫 번째로 작성해보세요!
                        </p>
                    )}
                </div>
            </div>

            {/* 감상 작성 폼 */}
            <ReviewForm
                bookId={bookId}
                members={members}
                reviewedMemberIds={reviewedMemberIds}
            />
        </div>
    );
}
