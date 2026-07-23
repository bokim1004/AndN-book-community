"use client";

interface Props {
    item: {
        id: number;
        title: string;
        author: string | null;
        category: string;
        link: string | null;
        note: string | null;
    };
}

export default function EditWishButton({ item }: Props) {
    function handleClick() {
        window.dispatchEvent(new CustomEvent("edit-wish", { detail: item }));
        document
            .getElementById("wish-form")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="shrink-0 rounded-full border border-ink/15 px-2.5 py-1 text-xs text-ink/45 transition-colors hover:border-ink/30 hover:text-ink/80"
        >
            수정
        </button>
    );
}
