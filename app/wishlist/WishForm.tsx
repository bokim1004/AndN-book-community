"use client";

import { addWishBook } from "@/app/actions/wishlist";
import { useEffect, useState } from "react";

const CATEGORIES = ["기획", "시스템", "사람", "기타"] as const;

const CATEGORY_STYLES: Record<string, string> = {
    기획: "border-brass/30 bg-brass/12 text-brass",
    시스템: "border-pine/25 bg-pine/12 text-pine",
    사람: "border-moss/30 bg-moss/15 text-moss",
    기타: "border-ink/15 bg-ink/[0.05] text-ink/55",
};

const EMPTY = { id: "", title: "", author: "", link: "", note: "" };

export default function WishForm() {
    const [category, setCategory] = useState<string>("기획");
    const [fields, setFields] = useState(EMPTY);
    const [submitted, setSubmitted] = useState(false);

    const editing = !!fields.id;

    // 목록의 "수정" 버튼이 보낸 이벤트를 받아 폼을 채운다
    useEffect(() => {
        function handleEdit(e: Event) {
            const d = (e as CustomEvent).detail;
            setCategory(d.category || "기타");
            setFields({
                id: String(d.id),
                title: d.title ?? "",
                author: d.author ?? "",
                link: d.link ?? "",
                note: d.note ?? "",
            });
        }
        window.addEventListener("edit-wish", handleEdit);
        return () => window.removeEventListener("edit-wish", handleEdit);
    }, []);

    function set(key: keyof typeof EMPTY, value: string) {
        setFields((f) => ({ ...f, [key]: value }));
    }

    function reset() {
        setFields(EMPTY);
        setCategory("기획");
    }

    async function handleSubmit(formData: FormData) {
        formData.set("category", category);
        await addWishBook(formData);
        reset();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
    }

    return (
        <div
            id="wish-form"
            className="rounded-sm border border-ink/10 bg-paper/50 p-6 shadow-[0_24px_60px_-34px_rgba(27,38,32,0.5)]"
        >
            <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-ink">
                    {editing ? "책 수정" : "읽고 싶은 책 추가"}
                </h3>
                {editing && (
                    <button
                        type="button"
                        onClick={reset}
                        className="text-xs text-ink/45 underline-offset-4 hover:text-ink/70 hover:underline"
                    >
                        새 책 추가로 전환
                    </button>
                )}
            </div>

            {submitted && (
                <div className="mt-4 rounded-sm border border-pine/20 bg-pine/[0.07] px-4 py-2 text-sm text-pine">
                    {editing ? "저장되었습니다." : "추가되었습니다."}
                </div>
            )}

            <form action={handleSubmit} className="mt-5 space-y-6">
                <input type="hidden" name="id" value={fields.id} />

                {/* 카테고리 */}
                <div>
                    <label className="mb-2.5 block font-display text-[0.7rem] uppercase tracking-[0.2em] text-moss">
                        카테고리
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((c) => {
                            const selected = category === c;
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setCategory(c)}
                                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                                        selected
                                            ? CATEGORY_STYLES[c]
                                            : "border-ink/15 text-ink/55 hover:border-ink/30"
                                    }`}
                                >
                                    {c}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 제목 */}
                <div>
                    <label className="mb-2.5 block font-display text-[0.7rem] uppercase tracking-[0.2em] text-moss">
                        제목
                    </label>
                    <input
                        name="title"
                        required
                        value={fields.title}
                        onChange={(e) => set("title", e.target.value)}
                        placeholder="책 제목"
                        className="w-full rounded-sm border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-pine/40 focus:outline-none focus:ring-2 focus:ring-pine/20"
                    />
                </div>

                {/* 저자 */}
                <div>
                    <label className="mb-2.5 block font-display text-[0.7rem] uppercase tracking-[0.2em] text-moss">
                        저자 <span className="text-ink/30">(선택)</span>
                    </label>
                    <input
                        name="author"
                        value={fields.author}
                        onChange={(e) => set("author", e.target.value)}
                        placeholder="지은이"
                        className="w-full rounded-sm border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-pine/40 focus:outline-none focus:ring-2 focus:ring-pine/20"
                    />
                </div>

                {/* 링크 */}
                <div>
                    <label className="mb-2.5 block font-display text-[0.7rem] uppercase tracking-[0.2em] text-moss">
                        링크 <span className="text-ink/30">(선택)</span>
                    </label>
                    <input
                        name="link"
                        type="url"
                        value={fields.link}
                        onChange={(e) => set("link", e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-sm border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-pine/40 focus:outline-none focus:ring-2 focus:ring-pine/20"
                    />
                </div>

                {/* 메모 */}
                <div>
                    <label className="mb-2.5 block font-display text-[0.7rem] uppercase tracking-[0.2em] text-moss">
                        메모 <span className="text-ink/30">(선택)</span>
                    </label>
                    <textarea
                        name="note"
                        value={fields.note}
                        onChange={(e) => set("note", e.target.value)}
                        placeholder="왜 읽고 싶은지, 추천받은 이유 등"
                        rows={2}
                        className="w-full resize-none rounded-sm border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-pine/40 focus:outline-none focus:ring-2 focus:ring-pine/20"
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-sm bg-pine px-6 py-2.5 text-sm text-paper transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(31,92,61,0.75)]"
                >
                    {editing ? "수정 저장" : "리스트에 추가"}
                </button>
            </form>
        </div>
    );
}
