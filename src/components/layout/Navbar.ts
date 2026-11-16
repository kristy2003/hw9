'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/mock-data';

export function Navbar() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      {/* 第一層：Logo、全站搜尋框、功能捷徑 */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* 網站品牌 */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="bg-amber-600 text-white font-black px-2.5 py-1 rounded text-lg tracking-wider">
            書狂
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-lg leading-none">
              小說推薦網
            </span>
            <span className="text-[11px] text-gray-400 tracking-tight mt-0.5">
              NOVEL HUB
            </span>
          </div>
        </Link>

        {/* 搜尋表單 */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-md flex items-center"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜尋書名、作者、標籤..."
            className="w-full h-9 px-3 text-sm bg-gray-50 border border-gray-300 rounded-l focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            className="h-9 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-r shrink-0 transition-colors cursor-pointer"
          >
            搜尋
          </button>
        </form>

        {/* 右側個人功能 */}
        <div className="flex items-center gap-3 shrink-0 text-sm">
          <Link
            href="/bookshelf"
            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded border border-gray-200 transition-colors"
          >
            <span>我的書架</span>
          </Link>
        </div>
      </div>

      {/* 第二層：主分類與榜單導覽條 (深色高對比，還原 czbooks 經典視覺) */}
      <nav className="bg-zinc-800 text-zinc-200 text-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center overflow-x-auto no-scrollbar">
          <Link
            href="/"
            className={`px-3.5 py-2.5 shrink-0 font-medium transition-colors ${
              pathname === '/'
                ? 'bg-amber-600 text-white'
                : 'hover:bg-zinc-700 hover:text-white'
            }`}
          >
            首頁
          </Link>

          {CATEGORIES.map((category) => {
            const href = `/category/${encodeURIComponent(category)}`;
            const isActive = pathname === href;
            return (
              <Link
                key={category}
                href={href}
                className={`px-3.5 py-2.5 shrink-0 transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white font-medium'
                    : 'hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {category}
              </Link>
            );
          })}

          <div className="h-4 w-[1px] bg-zinc-600 mx-1 shrink-0" />

          <Link
            href="/rank"
            className={`px-3.5 py-2.5 shrink-0 transition-colors ${
              pathname === '/rank'
                ? 'bg-amber-600 text-white font-medium'
                : 'text-amber-400 hover:bg-zinc-700'
            }`}
          >
            排行榜
          </Link>
          <Link
            href="/completed"
            className="px-3.5 py-2.5 shrink-0 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            全本完本
          </Link>
        </div>
      </nav>
    </header>
  );
}