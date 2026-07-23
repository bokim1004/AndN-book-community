import { prisma } from "@/app/src/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReviewForm from "./ReviewForm";
import EditReviewButton from "./EditReviewButton";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ id: string }>;
}

// 문예지 팔레트 기반 장르 태그
const GENRE_STYLES: Record<string, string> = {
    기획: "border-brass/30 bg-brass/12 text-brass",
    시스템: "border-pine/25 bg-pine/12 text-pine",
    사람: "border-moss/30 bg-moss/15 text-moss",
    기타: "border-ink/15 bg-ink/[0.05] text-ink/55",
};

function Stars({ value }: { value: number }) {
    return (
        <span className="inline-flex text-sm leading-none tracking-[0.1em]">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="relative">
                    <span className="text-ink/15">★</span>
                    <span
                        className="absolute inset-0 overflow-hidden text-brass"
                        style={{
                            width: `${Math.max(0, Math.min(1, value - (star - 1))) * 100}%`,
                        }}
                    >
                        ★
                    </span>
                </span>
            ))}
        </span>
    );
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

    const now = new Date();
    const isReading =
        !!book.startDate && book.startDate <= now && (!book.endDate || book.endDate >= now);

    return (
        <div className="min-h-screen bg-paper">
            <div className="mx-auto max-w-3xl px-6 pb-24 pt-10">
                {/* 뒤로 */}
                <Link
                    href="/books"
                    className="animate-float-up inline-flex items-center gap-1.5 font-display text-[0.7rem] uppercase tracking-[0.2em] text-moss transition-colors hover:text-pine"
                >
                    ← Library
                </Link>

                {/* ── 책 정보 ─────────────────────────── */}
                <section className="animate-float-up delay-1 mt-6 flex gap-6 rounded-sm border border-ink/10 bg-paper/50 p-6 shadow-[0_24px_60px_-34px_rgba(27,38,32,0.5)]">
                    <div className="relative aspect-[2/3] w-28 shrink-0 overflow-hidden rounded-sm border border-ink/10 bg-paper-deep shadow-[0_18px_40px_-26px_rgba(27,38,32,0.55)]">
                        {book.coverUrl ? (
                            <Image
                                src={book.coverUrl}
                                alt={book.title}
                                fill
                                sizes="112px"
                                priority
                                className="object-cover"
                            />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center font-display text-3xl italic text-ink/20">
                                {book.title.charAt(0)}
                            </span>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        {isReading ? (
                            <span className="inline-flex items-center gap-1.5 font-display text-[0.66rem] uppercase tracking-[0.16em] text-pine">
                                <span className="h-1.5 w-1.5 rounded-full bg-pine" />
                                읽는 중
                            </span>
                        ) : book.endDate ? (
                            <span className="font-display text-[0.66rem] uppercase tracking-[0.16em] text-moss">
                                완독
                            </span>
                        ) : null}

                        <h1 className="mt-2 font-serif text-2xl leading-tight text-ink sm:text-3xl">
                            {book.title}
                        </h1>
                        <p className="mt-1.5 text-sm text-ink/55">{book.author}</p>

                        {book.genre && (
                            <span
                                className={`mt-3 inline-block rounded-full border px-2.5 py-0.5 text-[0.72rem] font-medium ${
                                    GENRE_STYLES[book.genre] ?? "border-ink/15 bg-ink/[0.05] text-ink/55"
                                }`}
                            >
                                {book.genre}
                            </span>
                        )}

                        {book.startDate && (
                            <p className="mt-3 text-xs text-ink/45">
                                {book.startDate.toLocaleDateString("ko-KR")} ~{" "}
                                {book.endDate?.toLocaleDateString("ko-KR") ?? ""}
                            </p>
                        )}
                        {book.meeting && (
                            <p className="mt-1 text-xs text-ink/45">
                                모임 · {book.meeting.date.toLocaleDateString("ko-KR")}
                                {book.meeting.location && ` · ${book.meeting.location}`}
                            </p>
                        )}
                        {reviews.length > 0 && (
                            <div className="mt-3 flex items-center gap-2">
                                <Stars value={avgRating} />
                                <span className="text-xs text-ink/45">
                                    {avgRating.toFixed(1)} · {reviews.length}명
                                </span>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── 감상 목록 ───────────────────────── */}
                <section className="animate-float-up delay-2 mt-12">
                    <p className="border-b border-ink/15 pb-2 font-display text-[0.7rem] uppercase tracking-[0.28em] text-ink/45">
                        멤버 감상 · {reviews.length}
                    </p>

                    {reviews.length === 0 ? (
                        <p className="py-8 font-serif text-lg text-ink/45">
                            아직 감상이 없어요. 첫 번째로 작성해보세요.
                        </p>
                    ) : (
                        <ul>
                            {reviews.map((review) => (
                                <li
                                    key={review.id}
                                    className="flex items-start gap-4 border-b border-ink/10 py-5"
                                >
                                    <span
                                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                        style={{ backgroundColor: review.member.color }}
                                    >
                                        {review.member.name[0]}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2.5">
                                            <span className="font-serif text-[0.95rem] text-ink">
                                                {review.member.name}
                                            </span>
                                            <Stars value={review.rating} />
                                        </div>
                                        <p className="mt-1 text-sm leading-relaxed text-ink/65">
                                            {review.content}
                                        </p>
                                    </div>
                                    <EditReviewButton
                                        memberId={review.memberId}
                                        content={review.content}
                                        rating={review.rating}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* ── 감상 작성 폼 ─────────────────────── */}
                <div className="animate-float-up delay-3 mt-12">
                    <ReviewForm
                        bookId={bookId}
                        members={members}
                        reviewedMemberIds={reviewedMemberIds}
                    />
                </div>
            </div>
        </div>
    );
}
