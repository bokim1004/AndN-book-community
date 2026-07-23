"use client";

import { deleteWishBook } from "@/app/actions/wishlist";

export default function DeleteWishButton({ id }: { id: number }) {
    return (
        <form
            action={deleteWishBook}
            onSubmit={(e) => {
                if (!confirm("이 책을 리스트에서 삭제할까요?")) e.preventDefault();
            }}
        >
            <input type="hidden" name="id" value={id} />
            <button
                type="submit"
                aria-label="삭제"
                className="shrink-0 rounded-full border border-ink/15 px-2.5 py-1 text-xs text-ink/45 transition-colors hover:border-brass/40 hover:text-brass"
            >
                삭제
            </button>
        </form>
    );
}
