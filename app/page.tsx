import Image from "next/image";
import Link from "next/link";

const QUICK_LINKS = [
  {
    href: "/books",
    title: "책 목록",
    description: "함께 읽은 책과 감상으로 이동",
  },
  {
    href: "/calendar",
    title: "캘린더",
    description: "월별 독서 흐름 보기",
  },
  {
    href: "/stats",
    title: "통계",
    description: "카테고리와 감상 현황 확인",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      <section className="relative px-6 pt-16 pb-14 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />

        <div className="relative max-w-lg mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-md mb-8">
            <Image
              src="/bg_img.jpg"
              alt="AndN 북클럽"
              width={1200}
              height={420}
              priority
              className="w-full object-cover"
            />
          </div>

          <p className="text-gray-500 text-base mb-8">
            책을 함께 읽고, 생각을 나누어요
          </p>

          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              2025년부터 함께 읽고 있습니다
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
            {QUICK_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-2 py-4 text-center hover:bg-emerald-50 transition-colors"
              >
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-gray-400">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-6 pb-16">
        <Link
          href="/books"
          className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                AndN Reading
              </p>
              <h2 className="mt-2 text-lg font-bold text-gray-900">함께 읽은 책 보기</h2>
              <p className="mt-1 text-sm text-gray-500">
                책별 감상과 카테고리를 한 번에 볼 수 있어요.
              </p>
            </div>
            <span className="text-2xl text-emerald-600">→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
