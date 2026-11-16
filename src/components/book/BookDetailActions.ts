'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChapterSummary } from '@/types/novel';

interface BookActionsProps {
  bookId: string;
  firstChapterId: string;
}

export function BookActionButtons({ bookId, firstChapterId }: BookActionsProps) {
  const [inBookshelf, setInBookshelf] = useState(false);

  // 初始化檢查是否已在書架中
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('novel_bookshelf') || '[]');
      setInBookshelf(Array.isArray(saved) && saved.includes(bookId));
    } catch {
      setInBookshelf(false);
    }
  }, [bookId]);

  const toggleBookshelf = () => {
    try {
      const saved: string[] = JSON.parse(
        localStorage.getItem('novel_bookshelf') || '[]'
      );
      let updated: string[];
      if (saved.includes(bookId)) {
        updated = saved.filter((id) => id !== bookId);
        setInBookshelf(false);
      } else {
        updated = [...saved, bookId];
        setInBookshelf(true);
      }
      localStorage.setItem('novel_bookshelf', JSON.stringify(updated));
    } catch (err) {
      console.error('書架儲存失敗', err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-4">
      <Link
        href={`/book/${bookId}/${firstChapterId}`}
        className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded transition-colors"
      >
        開始閱讀
      </Link>

      <button
        type="button"
        onClick={toggleBookshelf}
        className={`px-5 py-2.5 text-sm font-medium rounded border transition-colors cursor-pointer ${
          inBookshelf
            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
            : 'bg-white border-gray-300 text-gray-700 hover:border-amber-500 hover:text-amber-600'
        }`}
      >
        {inBookshelf ? '✓ 已在書架中' : '+ 加入書架'}
      </button>
    </div>
  );
}

interface ChapterCatalogProps {
  bookId: string;
  chapters: ChapterSummary[];
}

export function ChapterCatalog({ bookId, chapters }: ChapterCatalogProps) {
  const [isReversed, setIsReversed] = useState(false);

  const displayedChapters = isReversed ? [...chapters].reverse() : chapters;

  return (
    <section className="bg-white border border-gray-200 rounded p-5">
      {/* 目錄標題與排序按鈕 */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 bg-amber-600 rounded-xs" />
          <h2 className="text-lg font-bold text-gray-900">
            章節目錄
            <span className="text-xs font-normal text-gray-400 ml-2">
              (共 {chapters.length} 章)
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsReversed(!isReversed)}
          className="text-xs px-3 py-1.5 rounded border border-gray-200 bg-gray-50 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 text-gray-600 transition-colors cursor-pointer"
        >
          {isReversed ? '↑ 目前：倒序（最新在前）' : '↓ 目前：正序（從頭開始）'}
        </button>
      </div>

      {/* 參考 czbooks 的三欄式緊湊章節網格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 divide-y md:divide-y-0 divide-gray-100">
        {displayedChapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/book/${bookId}/${chapter.id}`}
            className="py-2.5 px-2 text-sm text-gray-700 hover:text-amber-600 hover:bg-amber-50/50 border-b border-gray-100 truncate transition-colors flex items-center justify-between gap-2"
            title={chapter.title}
          >
            <span className="truncate">{chapter.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}