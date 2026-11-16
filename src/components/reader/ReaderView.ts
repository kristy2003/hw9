'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Chapter, Novel } from '@/types/novel';

type ReaderTheme = 'light' | 'sepia' | 'dark';

interface ReaderViewProps {
  novel: Novel;
  chapter: Chapter;
  prevChapterId: string | null;
  nextChapterId: string | null;
}

const THEME_STYLES: Record<
  ReaderTheme,
  {
    wrapper: string;
    paper: string;
    text: string;
    muted: string;
    border: string;
    btn: string;
  }
> = {
  light: {
    wrapper: 'bg-gray-100',
    paper: 'bg-white shadow-xs',
    text: 'text-gray-900',
    muted: 'text-gray-500',
    border: 'border-gray-200',
    btn: 'bg-white hover:bg-amber-50 text-gray-700 border-gray-300',
  },
  sepia: {
    wrapper: 'bg-[#e8e0cf]',
    paper: 'bg-[#f6f1e7] shadow-xs',
    text: 'text-[#3b3224]',
    muted: 'text-[#7a6d59]',
    border: 'border-[#dfd5c0]',
    btn: 'bg-[#efe8d8] hover:bg-[#e5dcc7] text-[#3b3224] border-[#d3c7b0]',
  },
  dark: {
    wrapper: 'bg-zinc-950',
    paper: 'bg-zinc-900 shadow-xs',
    text: 'text-zinc-300',
    muted: 'text-zinc-500',
    border: 'border-zinc-800',
    btn: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700',
  },
};

const FONT_SIZES = [16, 18, 20, 22, 24];

export function ReaderView({
  novel,
  chapter,
  prevChapterId,
  nextChapterId,
}: ReaderViewProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<ReaderTheme>('sepia');
  const [fontSize, setFontSize] = useState<number>(18);

  // 從 localStorage 載入使用者的閱讀設定
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(
        'reader_theme'
      ) as ReaderTheme | null;
      const savedFont = Number(localStorage.getItem('reader_font_size'));

      if (savedTheme && THEME_STYLES[savedTheme]) {
        setTheme(savedTheme);
      }
      if (FONT_SIZES.includes(savedFont)) {
        setFontSize(savedFont);
      }
    } catch {
      // 忽略存取錯誤
    }
  }, []);

  // 切換主題並儲存
  const handleThemeChange = (newTheme: ReaderTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('reader_theme', newTheme);
    } catch {}
  };

  // 調整字級並儲存
  const handleFontChange = (delta: number) => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    const nextIndex = Math.min(
      FONT_SIZES.length - 1,
      Math.max(0, currentIndex + delta)
    );
    const nextSize = FONT_SIZES[nextIndex];
    setFontSize(nextSize);
    try {
      localStorage.setItem('reader_font_size', String(nextSize));
    } catch {}
  };

  // 監聽鍵盤左右方向鍵切換上下章
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 若使用者正在輸入框打字則不觸發
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && prevChapterId) {
        router.push(`/book/${novel.id}/${prevChapterId}`);
      } else if (e.key === 'ArrowRight' && nextChapterId) {
        router.push(`/book/${novel.id}/${nextChapterId}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [novel.id, prevChapterId, nextChapterId, router]);

  const currentStyle = THEME_STYLES[theme];
  // 將內文依換行符號切分為獨立段落
  const paragraphs = chapter.content
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      className={`min-h-[calc(100vh-8rem)] -mx-4 -my-6 px-4 py-6 transition-colors duration-200 ${currentStyle.wrapper}`}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* 頂部麵包屑與閱讀器設定列 */}
        <div
          className={`p-3.5 rounded border flex flex-wrap items-center justify-between gap-3 ${currentStyle.paper} ${currentStyle.border}`}
        >
          {/* 麵包屑 */}
          <div className={`text-xs flex items-center gap-1.5 ${currentStyle.muted}`}>
            <Link href="/" className="hover:text-amber-600">
              首頁
            </Link>
            <span>/</span>
            <Link href={`/book/${novel.id}`} className="hover:text-amber-600">
              {novel.title}
            </Link>
            <span>/</span>
            <span className="truncate max-w-[140px] sm:max-w-xs">
              {chapter.title}
            </span>
          </div>

          {/* 閱讀器控制項：背景主題 + 字體大小 */}
          <div className="flex items-center gap-4 text-xs">
            {/* 主題圓點按鈕 */}
            <div className="flex items-center gap-1.5">
              <span className={currentStyle.muted}>背景：</span>
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                title="日間純白"
                className={`w-5 h-5 rounded-full bg-white border cursor-pointer ${
                  theme === 'light'
                    ? 'ring-2 ring-amber-500 border-amber-500'
                    : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => handleThemeChange('sepia')}
                title="護眼羊皮紙"
                className={`w-5 h-5 rounded-full bg-[#f6f1e7] border cursor-pointer ${
                  theme === 'sepia'
                    ? 'ring-2 ring-amber-500 border-amber-500'
                    : 'border-[#c8bca4]'
                }`}
              />
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                title="夜間深黑"
                className={`w-5 h-5 rounded-full bg-zinc-900 border cursor-pointer ${
                  theme === 'dark'
                    ? 'ring-2 ring-amber-500 border-amber-500'
                    : 'border-zinc-600'
                }`}
              />
            </div>

            {/* 字級縮放按鈕 */}
            <div className="flex items-center gap-1">
              <span className={currentStyle.muted}>字級：</span>
              <button
                type="button"
                onClick={() => handleFontChange(-1)}
                disabled={fontSize <= FONT_SIZES[0]}
                className={`px-2 py-0.5 rounded border disabled:opacity-40 cursor-pointer ${currentStyle.btn}`}
              >
                A-
              </button>
              <span className={`px-1.5 font-mono ${currentStyle.text}`}>
                {fontSize}
              </span>
              <button
                type="button"
                onClick={() => handleFontChange(1)}
                disabled={fontSize >= FONT_SIZES[FONT_SIZES.length - 1]}
                className={`px-2 py-0.5 rounded border disabled:opacity-40 cursor-pointer ${currentStyle.btn}`}
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* 正文閱讀紙張區 */}
        <article
          className={`px-6 py-8 sm:px-12 sm:py-10 rounded border transition-colors duration-200 ${currentStyle.paper} ${currentStyle.border}`}
        >
          {/* 章節標題與資訊 */}
          <header
            className={`pb-5 mb-6 border-b text-center ${currentStyle.border}`}
          >
            <h1
              className={`text-xl sm:text-2xl font-bold tracking-wide ${currentStyle.text}`}
            >
              {chapter.title}
            </h1>
            <div
              className={`flex items-center justify-center gap-4 text-xs mt-2.5 ${currentStyle.muted}`}
            >
              <span>書名：{novel.title}</span>
              <span>作者：{novel.author}</span>
              <span>字數：{chapter.wordCount} 字</span>
            </div>
          </header>

          {/* 小說正文段落 */}
          <div
            style={{ fontSize: `${fontSize}px` }}
            className={`space-y-5 leading-[1.9] tracking-wide select-text ${currentStyle.text}`}
          >
            {paragraphs.map((paragraph, idx) => (
              <p key={idx} className="indent-8">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* 底部章節切換導覽列 */}
        <div
          className={`p-4 rounded border flex items-center justify-between gap-2 text-sm ${currentStyle.paper} ${currentStyle.border}`}
        >
          {prevChapterId ? (
            <Link
              href={`/book/${novel.id}/${prevChapterId}`}
              className={`flex-1 text-center py-2.5 rounded border font-medium transition-colors ${currentStyle.btn}`}
            >
              ← 上一章
            </Link>
          ) : (
            <span
              className={`flex-1 text-center py-2.5 rounded border opacity-40 cursor-not-allowed ${currentStyle.btn}`}
            >
              已是第一章
            </span>
          )}

          <Link
            href={`/book/${novel.id}`}
            className={`flex-1 text-center py-2.5 rounded border font-medium transition-colors ${currentStyle.btn}`}
          >
            返回目錄
          </Link>

          {nextChapterId ? (
            <Link
              href={`/book/${novel.id}/${nextChapterId}`}
              className={`flex-1 text-center py-2.5 rounded border font-medium transition-colors ${currentStyle.btn}`}
            >
              下一章 →
            </Link>
          ) : (
            <span
              className={`flex-1 text-center py-2.5 rounded border opacity-40 cursor-not-allowed ${currentStyle.btn}`}
            >
              已是最新章
            </span>
          )}
        </div>

        {/* 鍵盤操作小提示 */}
        <p className={`text-center text-xs hidden sm:block ${currentStyle.muted}`}>
          提示：可使用鍵盤「←」與「→」方向鍵快速切換上一章 / 下一章
        </p>
      </div>
    </div>
  );
}