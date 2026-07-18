"use client";

import Link from "next/link";
import { useState } from "react";

const MONTH_NAMES = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export type CalendarBook = {
  id: number;
  title: string;
  author: string;
  genre: string | null;
  startDate: string;
  endDate: string | null;
  reviewCount: number;
};

type Props = {
  books: CalendarBook[];
  months: string[];
};

// 장르별 팔레트 (책 목록·통계와 동일 매핑)
const GENRE_CHIP: Record<string, string> = {
  기획: "bg-brass/12 text-brass hover:bg-brass/20",
  시스템: "bg-pine/12 text-pine hover:bg-pine/20",
  사람: "bg-moss/15 text-moss hover:bg-moss/25",
  기타: "bg-ink/[0.06] text-ink/65 hover:bg-ink/10",
};

function chipStyle(genre: string | null) {
  return GENRE_CHIP[genre ?? "기타"] ?? GENRE_CHIP["기타"];
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysForMonth(year: number, month: number) {
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const dayCount = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const leadingBlankCount = firstDay.getUTCDay();

  return [
    ...Array.from({ length: leadingBlankCount }, () => null),
    ...Array.from({ length: dayCount }, (_, i) => new Date(Date.UTC(year, month - 1, i + 1))),
  ];
}

function isBetween(dayKey: string, startDate: string, endDate: string | null) {
  return dayKey >= startDate && dayKey <= (endDate ?? startDate);
}

function booksForDay(books: CalendarBook[], day: Date) {
  const key = dateKey(day);

  return books.filter((book) => isBetween(key, book.startDate, book.endDate));
}

function booksForMonth(books: CalendarBook[], year: number, month: number) {
  const firstDay = dateKey(new Date(Date.UTC(year, month - 1, 1)));
  const lastDay = dateKey(new Date(Date.UTC(year, month, 0)));

  return books.filter((book) => book.startDate <= lastDay && (book.endDate ?? book.startDate) >= firstDay);
}

export default function CalendarView({ books, months }: Props) {
  const [monthIndex, setMonthIndex] = useState(0);
  const currentMonthKey = months[monthIndex];
  const [year, month] = currentMonthKey.split("-").map(Number);
  const days = daysForMonth(year, month);
  const monthBooks = booksForMonth(books, year, month);
  const canGoPrev = monthIndex < months.length - 1;
  const canGoNext = monthIndex > 0;

  return (
    <section className="animate-float-up delay-2 overflow-hidden rounded-sm border border-ink/10 shadow-[0_28px_70px_-40px_rgba(27,38,32,0.55)]">
      <div className="bg-ink px-3 py-4 text-paper sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMonthIndex((index) => Math.min(index + 1, months.length - 1))}
            disabled={!canGoPrev}
            aria-label="이전 달"
            className="grid h-9 w-9 place-items-center rounded-sm border border-paper/25 text-lg transition-colors hover:bg-paper/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ‹
          </button>

          <div className="text-center">
            <h2 className="font-serif text-lg">
              {year}년 {MONTH_NAMES[month - 1]}
            </h2>
            <p className="mt-0.5 font-display text-[0.66rem] uppercase tracking-[0.18em] text-paper/55">
              {monthBooks.length} Volumes
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMonthIndex((index) => Math.max(index - 1, 0))}
            disabled={!canGoNext}
            aria-label="다음 달"
            className="grid h-9 w-9 place-items-center rounded-sm border border-paper/25 text-lg transition-colors hover:bg-paper/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-ink/10 bg-paper-deep/50">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="px-2 py-2.5 text-center font-display text-[0.64rem] uppercase tracking-[0.12em] text-ink/40"
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-ink/10">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`blank-${index}`} className="min-h-24 bg-paper-deep/30 sm:min-h-32" />;
          }

          const dayBooks = booksForDay(books, day);

          return (
            <div key={dateKey(day)} className="min-h-24 bg-paper p-1.5 sm:min-h-32 sm:p-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-display text-xs text-ink/45">{day.getUTCDate()}</span>
                {dayBooks.length > 0 && (
                  <span className="text-[10px] font-medium text-pine">{dayBooks.length}</span>
                )}
              </div>

              <div className="space-y-1">
                {dayBooks.map((book) => {
                  const isStart = dateKey(day) === book.startDate;
                  const isEnd = book.endDate ? dateKey(day) === book.endDate : false;

                  return (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      className={`block rounded-[3px] px-1.5 py-1 text-[10px] leading-tight transition-colors sm:text-xs ${chipStyle(
                        book.genre
                      )}`}
                      title={`${book.title} - ${book.author}`}
                    >
                      <span className="block truncate font-medium">{book.title}</span>
                      {(isStart || isEnd) && (
                        <span className="mt-0.5 block text-[9px] uppercase tracking-[0.08em] opacity-70 sm:text-[10px]">
                          {isStart ? "시작" : "완료"}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
