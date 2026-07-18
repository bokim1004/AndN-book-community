"use client";

import { upsertReview } from "@/app/actions/reviews";
import { useState } from "react";

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
    const [submitted, setSubmitted] = useState(false);

    const alreadyReviewed =
        selectedMemberId && reviewedMemberIds.includes(parseInt(selectedMemberId));

    async function handleSubmit(formData: FormData) {
        formData.set("bookId", bookId.toString());
        formData.set("rating", rating.toString());
        await upsertReview(formData);
        setSelectedMemberId("");
        setRating(0);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
    }

    return (
        <div className="rounded-sm border border-ink/10 bg-paper/50 p-6 shadow-[0_24px_60px_-34px_rgba(27,38,32,0.5)]">
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
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="text-2xl leading-none transition-transform hover:scale-110"
                            >
                                <span
                                    className={
                                        star <= (hoverRating || rating)
                                            ? "text-brass"
                                            : "text-ink/15"
                                    }
                                >
                                    ★
                                </span>
                            </button>
                        ))}
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
