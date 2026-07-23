"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/books", label: "책 목록" },
  { href: "/wishlist", label: "읽고 싶은 책" },
  { href: "/calendar", label: "캘린더" },
  { href: "/stats", label: "통계" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-5 ml-2">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm transition-colors ${
              active
                ? "text-pine font-medium"
                : "text-ink/55 hover:text-ink"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
