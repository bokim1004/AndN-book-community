"use server";

import { prisma } from "@/app/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addWishBook(formData: FormData) {
    const idRaw = formData.get("id") as string;
    const id = idRaw ? parseInt(idRaw) : null;
    const title = (formData.get("title") as string)?.trim();
    const author = (formData.get("author") as string)?.trim();
    const category = (formData.get("category") as string) || "기타";
    const note = (formData.get("note") as string)?.trim();
    const link = (formData.get("link") as string)?.trim();

    if (!title) return;

    const data = {
        title,
        author: author || null,
        category,
        note: note || null,
        link: link || null,
    };

    if (id) {
        await prisma.wishBook.update({ where: { id }, data });
    } else {
        await prisma.wishBook.create({ data });
    }

    revalidatePath("/wishlist");
}

export async function deleteWishBook(formData: FormData) {
    const id = parseInt(formData.get("id") as string);
    await prisma.wishBook.delete({ where: { id } });

    revalidatePath("/wishlist");
}
