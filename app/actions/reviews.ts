"use server";

import { prisma } from "@/app/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertReview(formData: FormData) {
    const bookId = parseInt(formData.get("bookId") as string);
    const memberId = parseInt(formData.get("memberId") as string);
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string);

    await prisma.review.upsert({
        where: { bookId_memberId: { bookId, memberId } },
        update: { content, rating },
        create: { bookId, memberId, content, rating },
    });

    revalidatePath(`/books/${bookId}`);
    revalidatePath("/stats");
}
