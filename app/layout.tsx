import type { Metadata } from "next";
import { Fraunces, Nanum_Myeongjo, IBM_Plex_Sans_KR } from "next/font/google";
import HeaderNav from "@/app/HeaderNav";
import Link from "next/link";
import "./globals.css";

// 라틴 디스플레이 — 에디토리얼 세리프 (eyebrow / 로고)
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// 한글 디스플레이 — 명조 (제목)
const myeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-serif-kr",
  display: "swap",
});

// 본문 — 깔끔한 한글 산세리프
const plexKr = IBM_Plex_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AndN 북클럽",
  description: "AndN 독서 모임 커뮤니티",
  openGraph: {
    title: "AndN 북클럽",
    description: "AndN 독서 모임 커뮤니티",
    images: [
      {
        url: "/mainBg.png",
        width: 1024,
        height: 559,
        alt: "AndN 북클럽",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AndN 북클럽",
    description: "AndN 독서 모임 커뮤니티",
    images: ["/mainBg.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`h-full antialiased ${fraunces.variable} ${myeongjo.variable} ${plexKr.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper text-ink" suppressHydrationWarning>
        <nav className="bg-paper/80 backdrop-blur-md border-b border-ink/10 px-6 py-4 flex items-center gap-6 sticky top-0 z-10">
          <Link
            href="/"
            className="font-display italic text-pine text-lg tracking-tight"
          >
            AndN
          </Link>
          <HeaderNav />
          {/* <Link href="/admin" className="ml-auto text-sm text-gray-400 hover:text-gray-600 transition-colors">관리자</Link> */}
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
