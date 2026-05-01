import { prisma } from "@/app/src/lib/prisma";
import { deleteBook } from "@/app/actions/books";
import BookForm from "./BookForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const books = await prisma.book.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { reviews: true } },
            meeting: true,
        },
    });

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-6">관리자</h1>

            <BookForm />

            <div className="mt-10">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    등록된 책 ({books.length}권)
                </h2>
                <div className="space-y-2">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 truncate">{book.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {book.author}
                                    {book.genre && ` · ${book.genre}`}
                                    {` · 감상 ${book._count.reviews}개`}
                                </p>
                                {book.startDate && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {book.startDate.toLocaleDateString("ko-KR")} ~{" "}
                                        {book.endDate?.toLocaleDateString("ko-KR")}
                                    </p>
                                )}
                            </div>
                            <form action={deleteBook}>
                                <input type="hidden" name="id" value={book.id} />
                                <button
                                    type="submit"
                                    className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                                >
                                    삭제
                                </button>
                            </form>
                        </div>
                    ))}
                    {books.length === 0 && (
                        <p className="text-sm text-gray-400 py-4">등록된 책이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
