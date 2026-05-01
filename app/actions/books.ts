"use server";

import { prisma } from "@/app/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBook(formData: FormData) {
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const genre = formData.get("genre") as string;
    const coverUrl = formData.get("coverUrl") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    await prisma.book.create({
        data: {
            title,
            author,
            genre: genre || null,
            coverUrl: coverUrl || null,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        },
    });

    revalidatePath("/admin");
    revalidatePath("/books");
    revalidatePath("/calendar");
    revalidatePath("/stats");
}

export async function deleteBook(formData: FormData) {
    const id = parseInt(formData.get("id") as string);
    await prisma.book.delete({ where: { id } });

    revalidatePath("/admin");
    revalidatePath("/books");
    revalidatePath("/calendar");
    revalidatePath("/stats");
}
