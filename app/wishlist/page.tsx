import { prisma } from "@/app/src/lib/prisma";
import WishForm from "./WishForm";
import DeleteWishButton from "./DeleteWishButton";
import EditWishButton from "./EditWishButton";

export const dynamic = "force-dynamic";

const CATEGORIES = ["기획", "시스템", "사람", "기타"] as const;

const CATEGORY_STYLES: Record<string, string> = {
    기획: "border-brass/30 bg-brass/12 text-brass",
    시스템: "border-pine/25 bg-pine/12 text-pine",
    사람: "border-moss/30 bg-moss/15 text-moss",
    기타: "border-ink/15 bg-ink/[0.05] text-ink/55",
};

export default async function WishlistPage() {
    const wishBooks = await prisma.wishBook.findMany({
        orderBy: { createdAt: "desc" },
    });

    const grouped = CATEGORIES.map((category) => ({
        category,
        items: wishBooks.filter((b) => b.category === category),
    }));

    return (
        <div className="min-h-screen bg-paper">
            <div className="mx-auto max-w-3xl px-6 pb-24">
                {/* ── 마스트헤드 ─────────────────────── */}
                <header className="pt-16 pb-10">
                    <p className="animate-float-up font-display text-[0.7rem] uppercase tracking-[0.32em] text-moss">
                        AndN · Reading List
                    </p>
                    <h1 className="animate-float-up delay-1 mt-5 font-serif text-5xl leading-[1.05] text-ink sm:text-6xl">
                        읽고 싶은 책
                    </h1>
                    <p className="animate-float-up delay-2 mt-5 max-w-md text-[0.95rem] leading-relaxed text-ink/55">
                        나중에 함께 읽고 싶은 책들을 기획 · 시스템 · 사람 · 기타로
                        나눠 모아두는 공간이에요. {wishBooks.length}권이 담겨 있어요.
                    </p>
                </header>

                {/* ── 추가 폼 ─────────────────────────── */}
                <div className="animate-float-up delay-2 mb-12">
                    <WishForm />
                </div>

                {/* ── 카테고리별 목록 ──────────────────── */}
                {wishBooks.length === 0 ? (
                    <p className="border-t border-ink/10 py-16 text-center font-serif text-xl text-ink/45">
                        아직 담긴 책이 없어요. 위에서 첫 책을 추가해보세요.
                    </p>
                ) : (
                    <div className="space-y-12">
                        {grouped.map(({ category, items }) =>
                            items.length === 0 ? null : (
                                <section
                                    key={category}
                                    className="animate-float-up delay-3"
                                >
                                    <div className="flex items-baseline justify-between border-b border-ink/15 pb-2">
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className={`rounded-full border px-2.5 py-0.5 text-[0.72rem] font-medium ${CATEGORY_STYLES[category]}`}
                                            >
                                                {category}
                                            </span>
                                            <span className="font-display text-[0.7rem] uppercase tracking-[0.2em] text-ink/40">
                                                {items.length}권
                                            </span>
                                        </div>
                                    </div>

                                    <ul>
                                        {items.map((b) => (
                                            <li
                                                key={b.id}
                                                className="flex items-start gap-4 border-b border-ink/10 py-4"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                                                        {b.link ? (
                                                            <a
                                                                href={b.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="font-serif text-[0.98rem] text-ink underline-offset-4 transition-colors hover:text-pine hover:underline"
                                                            >
                                                                {b.title}
                                                            </a>
                                                        ) : (
                                                            <span className="font-serif text-[0.98rem] text-ink">
                                                                {b.title}
                                                            </span>
                                                        )}
                                                        {b.author && (
                                                            <span className="text-xs text-ink/45">
                                                                {b.author}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {b.note && (
                                                        <p className="mt-1 text-sm leading-relaxed text-ink/60">
                                                            {b.note}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex shrink-0 items-center gap-1.5">
                                                    <EditWishButton item={b} />
                                                    <DeleteWishButton id={b.id} />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ),
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
