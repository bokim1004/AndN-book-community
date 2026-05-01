import type { Metadata } from "next";
import HeaderNav from "@/app/HeaderNav";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
    title: "AndN 북클럽",
    description: "AndN 독서 모임 커뮤니티",
    openGraph: {
        title: "AndN 북클럽",
        description: "AndN 독서 모임 커뮤니티",
        images: [
            {
                url: "/bg_img.jpg",
                width: 1200,
                height: 420,
                alt: "AndN 북클럽",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AndN 북클럽",
        description: "AndN 독서 모임 커뮤니티",
        images: ["/bg_img.jpg"],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" className="h-full antialiased">
            <body className="min-h-full flex flex-col bg-gray-50">
                <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-6 sticky top-0 z-10 shadow-sm">
                    <Link href="/" className="font-bold text-emerald-700 text-base tracking-tight">
                        AndN 북클럽
                    </Link>
                    <HeaderNav />
                    {/* <Link href="/admin" className="ml-auto text-sm text-gray-400 hover:text-gray-600 transition-colors">관리자</Link> */}
                </nav>
                <main className="flex-1">{children}</main>
            </body>
        </html>
    );
}
