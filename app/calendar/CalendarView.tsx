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
    <section className="bg-white border border-gray-200 overflow-hidden">
      <div className="bg-emerald-700 text-white px-3 py-3 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMonthIndex((index) => Math.min(index + 1, months.length - 1))}
            disabled={!canGoPrev}
            aria-label="이전 달"
            className="grid h-9 w-9 place-items-center rounded border border-emerald-500 text-lg disabled:cursor-not-allowed disabled:opacity-30"
          >
            ‹
          </button>

          <div className="text-center">
            <h2 className="font-semibold text-base">
              {year}년 {MONTH_NAMES[month - 1]}
            </h2>
            <p className="mt-0.5 text-xs text-emerald-200">{monthBooks.length}권</p>
          </div>

          <button
            type="button"
            onClick={() => setMonthIndex((index) => Math.max(index - 1, 0))}
            disabled={!canGoNext}
            aria-label="다음 달"
            className="grid h-9 w-9 place-items-center rounded border border-emerald-500 text-lg disabled:cursor-not-allowed disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="px-2 py-2 text-center text-[11px] font-medium text-gray-500">
            {weekday}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 bg-gray-100 gap-px">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`blank-${index}`} className="min-h-24 bg-gray-50 sm:min-h-32" />;
          }

          const dayBooks = booksForDay(books, day);

          return (
            <div key={dateKey(day)} className="min-h-24 bg-white p-1.5 sm:min-h-32 sm:p-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{day.getUTCDate()}</span>
                {dayBooks.length > 0 && <span className="text-[10px] text-emerald-700">{dayBooks.length}</span>}
              </div>

              <div className="space-y-1">
                {dayBooks.map((book) => {
                  const isStart = dateKey(day) === book.startDate;
                  const isEnd = book.endDate ? dateKey(day) === book.endDate : false;

                  return (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      className="block rounded bg-emerald-50 px-1.5 py-1 text-[10px] leading-tight text-emerald-900 hover:bg-emerald-100 sm:text-xs"
                      title={`${book.title} - ${book.author}`}
                    >
                      <span className="block truncate font-medium">{book.title}</span>
                      {(isStart || isEnd) && (
                        <span className="mt-0.5 block text-[9px] text-emerald-700 sm:text-[10px]">
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
