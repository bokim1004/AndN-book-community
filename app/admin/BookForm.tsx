"use client";

import { createBook } from "@/app/actions/books";
import { useRef } from "react";

export default function BookForm() {
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        await createBook(formData);
        formRef.current?.reset();
    }

    return (
        <form ref={formRef} action={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">책 등록</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-500 block mb-1">제목 *</label>
                    <input
                        name="title"
                        required
                        placeholder="책 제목"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 block mb-1">저자 *</label>
                    <input
                        name="author"
                        required
                        placeholder="저자명"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 block mb-1">장르</label>
                    <select
                        name="genre"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                    >
                        <option value="">선택 안함</option>
                        <option value="기획">기획</option>
                        <option value="시스템">시스템</option>
                        <option value="사람">사람</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-500 block mb-1">표지 이미지 URL</label>
                    <input
                        name="coverUrl"
                        type="url"
                        placeholder="https://..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 block mb-1">시작일</label>
                    <input
                        name="startDate"
                        type="date"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 block mb-1">종료일</label>
                    <input
                        name="endDate"
                        type="date"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
            </div>
            <button
                type="submit"
                className="mt-5 bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
                등록하기
            </button>
        </form>
    );
}
