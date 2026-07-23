"use client";

interface Props {
    memberId: number;
    content: string;
    rating: number;
}

export default function EditReviewButton({ memberId, content, rating }: Props) {
    function handleClick() {
        window.dispatchEvent(
            new CustomEvent("edit-review", {
                detail: { memberId, content, rating },
            }),
        );
        document
            .getElementById("review-form")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="shrink-0 rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/55 transition-colors hover:border-ink/30 hover:text-ink/80"
        >
            수정
        </button>
    );
}
