"use client";

import { upsertReview } from "@/app/actions/reviews";
import { useEffect, useState } from "react";

interface Member {
    id: number;
    name: string;
    color: string;
}

interface Props {
    bookId: number;
    members: Member[];
    reviewedMemberIds: number[];
}

export default function ReviewForm({ bookId, members, reviewedMemberIds }: Props) {
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const alreadyReviewed =
        selectedMemberId && reviewedMemberIds.includes(parseInt(selectedMemberId));

    // 감상 목록의 "수정" 버튼이 보낸 이벤트를 받아 폼을 채운다
    useEffect(() => {
        function handleEdit(e: Event) {
            const { memberId, content, rating } = (e as CustomEvent).detail;
            setSelectedMemberId(memberId.toString());
            setRating(rating);
            setContent(content);
        }
        window.addEventListener("edit-review", handleEdit);
        return () => window.removeEventListener("edit-review", handleEdit);
    }, []);

    async function handleSubmit(formData: FormData) {
        formData.set("bookId", bookId.toString());
        formData.set("rating", rating.toString());
        await upsertReview(formData);
        setSelectedMemberId("");
        setRating(0);
        setContent("");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
    }

    return (
        <div id="review-form" className="rounded-sm border border-ink/10 bg-paper/50 p-6 shadow-[0_24px_60px_-34px_rgba(27,38,32,0.5)]">
            <h3 className="font-serif text-xl text-ink">
                {alreadyReviewed ? "감상 수정" : "감상 작성"}
            </h3>

            {submitted && (
                <div className="mt-4 rounded-sm border border-pine/20 bg-pine/[0.07] px-4 py-2 text-sm text-pine">
                    저장되었습니다.
                </div>
            )}

            <form action={handleSubmit} className="mt-5 space-y-6">
                <input type="hidden" name="memberId" value={selectedMemberId} />

                {/* 이름 선택 */}
                <div>
                    <label className="mb-2.5 block font-display text-[0.7rem] uppercase tracking-[0.2em] text-moss">
                        이름 선택
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {members.map((member) => {
                            const selected = selectedMemberId === member.id.toString();
                            return (
                                <button
                                    key={member.id}
                                    type="button"
                                    onClick={() => setSelectedMemberId(member.id.toString())}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                                        selected
                                            ? "border-transparent text-white shadow-sm"
                                            : "border-ink/15 text-ink/70 hover:border-ink/30"
                                    }`}
                                    style={
                                        selected
                                            ? { backgroundColor: member.color }
                                            : undefined
                                    }
                                >
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{
                                            backgroundColor: selected ? "#ffffff" : member.color,
                                        }}
                                    />
                                    {member.name}
                                </button>
                            );
                        })}
                    </div>
                    {alreadyReviewed && (
                        <p className="mt-2 text-xs text-brass">
                            이미 작성한 감상이 있어요. 수정됩니다.
                        </p>
                    )}
                </div>

                {/* 별점 */}
                <div>
                    <label className="mb-2.5 block font-display text-[0.7rem] uppercase tracking-[0.2em] text-moss">
                        별점
                    </label>
                    <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((star) => {
                            const active = hoverRating || rating;
                            return (
                                <div
                                    key={star}
                                    className="relative text-2xl leading-none transition-transform hover:scale-110"
                                >
                                    {/* 배경(빈 별) */}
                                    <span className="text-ink/15">★</span>
                                    {/* 채워진 별: active 값만큼 왼쪽부터 노출 */}
                                    <span
                                        className="absolute inset-0 overflow-hidden text-brass"
                                        style={{
                                            width: `${Math.max(0, Math.min(1, active - (star - 1))) * 100}%`,
                                        }}
                                    >
                                        ★
                                    </span>
                                    {/* 왼쪽 절반 = 0.5점 */}
                                    <button
                                        type="button"
                                        aria-label={`${star - 0.5}점`}
                                        onClick={() => setRating(star - 0.5)}
                                        onMouseEnter={() => setHoverRating(star - 0.5)}
                                        className="absolute inset-y-0 left-0 w-1/2"
                                    />
                                    {/* 오른쪽 절반 = 1점 */}
                                    <button
                                        type="button"
                                        aria-label={`${star}점`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        className="absolute inset-y-0 right-0 w-1/2"
                                    />
                                </div>
                            );
                        })}
                        {rating > 0 && (
                            <span className="ml-2 self-center text-sm text-ink/45">{rating}점</span>
                        )}
                    </div>
                </div>

                {/* 한줄 감상 */}
                <div>
                    <label className="mb-2.5 block font-display text-[0.7rem] uppercase tracking-[0.2em] text-moss">
                        한줄 감상
                    </label>
                    <textarea
                        name="content"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="이 책에 대한 감상을 작성해주세요"
                        className="w-full resize-none rounded-sm border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-pine/40 focus:outline-none focus:ring-2 focus:ring-pine/20"
                        rows={3}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!selectedMemberId || rating === 0}
                    className="rounded-sm bg-pine px-6 py-2.5 text-sm text-paper transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(31,92,61,0.75)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
                >
                    {alreadyReviewed ? "수정하기" : "작성하기"}
                </button>
            </form>
        </div>
    );
}
