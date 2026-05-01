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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
                {alreadyReviewed ? "감상 수정" : "감상 작성"}
            </h3>

            {submitted && (
                <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg">
                    저장되었습니다!
                </div>
            )}

            <form action={handleSubmit} className="space-y-4">
                <input type="hidden" name="memberId" value={selectedMemberId} />

                <div>
                    <label className="text-xs text-gray-500 block mb-2">이름 선택</label>
                    <div className="flex flex-wrap gap-2">
                        {members.map((member) => (
                            <button
                                key={member.id}
                                type="button"
                                onClick={() => setSelectedMemberId(member.id.toString())}
                                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all border-2"
                                style={{
                                    backgroundColor:
                                        selectedMemberId === member.id.toString()
                                            ? member.color
                                            : "transparent",
                                    borderColor: member.color,
                                    color:
                                        selectedMemberId === member.id.toString()
                                            ? "white"
                                            : member.color,
                                }}
                            >
                                {member.name}
                            </button>
                        ))}
                    </div>
                    {alreadyReviewed && (
                        <p className="text-xs text-amber-500 mt-2">이미 작성한 감상이 있어요. 수정됩니다.</p>
                    )}
                </div>

                <div>
                    <label className="text-xs text-gray-500 block mb-2">별점</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="text-2xl transition-transform hover:scale-110 leading-none"
                            >
                                <span style={{ color: star <= (hoverRating || rating) ? "#F59E0B" : "#D1D5DB" }}>
                                    ★
                                </span>
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="text-sm text-gray-400 ml-2 self-center">{rating}점</span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-500 block mb-2">한줄 감상</label>
                    <textarea
                        name="content"
                        required
                        placeholder="이 책에 대한 감상을 작성해주세요"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                        rows={3}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!selectedMemberId || rating === 0}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {alreadyReviewed ? "수정하기" : "작성하기"}
                </button>
            </form>
        </div>
    );
}
