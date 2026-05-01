import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AndN 북클럽",
    description: "AndN 독서 모임 커뮤니티",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col bg-gray-50">
                <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-6 sticky top-0 z-10 shadow-sm">
                    <Link href="/" className="font-bold text-emerald-700 text-base tracking-tight">
                        AndN 북클럽
                    </Link>
                    <div className="flex gap-5 ml-2">
                        <Link href="/books" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">책 목록</Link>
                        <Link href="/calendar" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">캘린더</Link>
                        <Link href="/stats" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">통계</Link>
                    </div>
                    <Link href="/admin" className="ml-auto text-sm text-gray-400 hover:text-gray-600 transition-colors">관리자</Link>
                </nav>
                <main className="flex-1">{children}</main>
            </body>
        </html>
    );
}
