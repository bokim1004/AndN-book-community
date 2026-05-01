import { prisma } from "@/app/src/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

const GENRE_TAG_STYLES: Record<string, string> = {
    기획: "bg-amber-50 text-amber-700 border-amber-100",
    시스템: "bg-sky-50 text-sky-700 border-sky-100",
    사람: "bg-rose-50 text-rose-700 border-rose-100",
    기타: "bg-gray-50 text-gray-600 border-gray-200",
};

export default async function BooksPage() {
    const books = await prisma.book.findMany({
        orderBy: { startDate: "desc" },
        include: {
            _count: { select: { reviews: true } },
        },
    });

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-6">읽은 책 목록</h1>
            {books.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-5xl mb-4">📚</p>
                    <p className="text-sm">아직 등록된 책이 없어요.</p>
                    <Link href="/admin" className="text-emerald-600 hover:underline text-sm mt-2 inline-block">
                        첫 번째 책 등록하기 →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {books.map((book) => (
                        <Link key={book.id} href={`/books/${book.id}`} className="group">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all">
                                {book.coverUrl ? (
                                    <Image
                                        src={book.coverUrl}
                                        alt={book.title}
                                        width={240}
                                        height={360}
                                        className="w-full h-44 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-44 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                                        <span className="text-4xl">📚</span>
                                    </div>
                                )}
                                <div className="p-3">
                                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">{book.author}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        {book.genre && (
                                            <span
                                                className={`text-xs border px-2 py-0.5 rounded-full ${
                                                    GENRE_TAG_STYLES[book.genre] ?? "bg-gray-50 text-gray-600 border-gray-100"
                                                }`}
                                            >
                                                {book.genre}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-400 ml-auto">
                                            감상 {book._count.reviews}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
