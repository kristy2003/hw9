import Link from 'next/link';
import { MOCK_NOVELS, CATEGORIES } from '@/lib/mock-data';
import { BookCard } from '@/components/book/BookCard';

export default function HomePage() {
  // 1. 編輯強推（取推薦分數最高的前 4 本）
  const featuredNovels = [...MOCK_NOVELS]
    .sort((a, b) => b.recommendScore - a.recommendScore)
    .slice(0, 4);

  // 2. 人氣排行榜（依點擊量排序）
  const popularNovels = [...MOCK_NOVELS].sort((a, b) => b.views - a.views);

  // 3. 最新更新列表
  const recentUpdates = [...MOCK_NOVELS];

  // 4. 分類精選區塊（挑選前 4 個熱門分類展示）
  const highlightCategories = CATEGORIES.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* ==================== 區塊一：編輯強推 + 人氣風雲榜 ==================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左側 8 欄：編輯強推區 */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded p-4">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 bg-amber-600 rounded-xs" />
              <h2 className="text-lg font-bold text-gray-900">編輯強推精選</h2>
            </div>
            <span className="text-xs text-gray-400">每日精選高口碑佳作</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredNovels.map((novel) => (
              <BookCard key={novel.id} novel={novel} />
            ))}
          </div>
        </div>

        {/* 右側 4 欄：本週人氣風雲榜 */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 bg-red-600 rounded-xs" />
              <h2 className="text-lg font-bold text-gray-900">人氣風雲榜</h2>
            </div>
            <Link
              href="/rank"
              className="text-xs text-amber-600 hover:underline"
            >
              完整榜單 &gt;
            </Link>
          </div>

          <ul className="divide-y divide-gray-100 flex-1 flex flex-col justify-between">
            {popularNovels.map((novel, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;
              return (
                <li
                  key={novel.id}
                  className="py-2.5 flex items-center justify-between gap-2 text-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 shrink-0 rounded text-xs font-bold flex items-center justify-center ${
                        rank === 1
                          ? 'bg-red-600 text-white'
                          : rank === 2
                          ? 'bg-orange-500 text-white'
                          : rank === 3
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {rank}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">
                      [{novel.category.slice(0, 2)}]
                    </span>
                    <Link
                      href={`/book/${novel.id}`}
                      className={`truncate hover:text-amber-600 ${
                        isTop3 ? 'font-bold text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {novel.title}
                    </Link>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {novel.author}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ==================== 區塊二：分類精選推薦 ==================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlightCategories.map((category) => {
          // 篩選該分類書籍（若假資料不足則顯示全部以維持版面飽滿）
          const categoryBooks = MOCK_NOVELS.filter(
            (n) => n.category === category
          );
          const displayBooks =
            categoryBooks.length > 0 ? categoryBooks : MOCK_NOVELS.slice(0, 3);
          const topBook = displayBooks[0];
          const listBooks = displayBooks.slice(1);

          return (
            <div
              key={category}
              className="bg-white border border-gray-200 rounded p-4"
            >
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-zinc-800 rounded-xs" />
                  <h3 className="font-bold text-gray-900">{category}</h3>
                </div>
                <Link
                  href={`/category/${encodeURIComponent(category)}`}
                  className="text-xs text-gray-500 hover:text-amber-600"
                >
                  更多 &gt;
                </Link>
              </div>

              {/* 該分類頭條推薦 */}
              {topBook && (
                <div className="flex gap-3 pb-3 mb-2 border-b border-dashed border-gray-200">
                  <Link
                    href={`/book/${topBook.id}`}
                    className="w-16 h-22 shrink-0 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-[11px] text-gray-400 text-center p-1"
                  >
                    {topBook.category}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/book/${topBook.id}`}
                      className="font-bold text-sm text-gray-900 hover:text-amber-600 block truncate"
                    >
                      {topBook.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {topBook.description}
                    </p>
                    <div className="text-[11px] text-gray-400 mt-1.5 flex items-center justify-between">
                      <span>作者：{topBook.author}</span>
                      <span className="text-amber-600 font-medium">
                        {topBook.recommendScore} 分
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 該分類其餘書單 */}
              <ul className="space-y-2 text-sm">
                {listBooks.map((book) => (
                  <li
                    key={book.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-amber-600 text-xs">▪</span>
                      <Link
                        href={`/book/${book.id}`}
                        className="text-gray-800 hover:text-amber-600 truncate"
                      >
                        {book.title}
                      </Link>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {book.author}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* ==================== 區塊三：全站最新更新列表 (高密度表格) ==================== */}
      <section className="bg-white border border-gray-200 rounded p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 bg-emerald-600 rounded-xs" />
            <h2 className="text-lg font-bold text-gray-900">最新章節更新</h2>
          </div>
          <span className="text-xs text-gray-400">即時同步全站連載進度</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 bg-gray-50">
                <th className="py-2.5 px-3 font-medium w-24">分類</th>
                <th className="py-2.5 px-3 font-medium">書名</th>
                <th className="py-2.5 px-3 font-medium">最新章節</th>
                <th className="py-2.5 px-3 font-medium w-28">作者</th>
                <th className="py-2.5 px-3 font-medium w-24 hidden sm:table-cell">
                  狀態
                </th>
                <th className="py-2.5 px-3 font-medium w-28 text-right">
                  更新時間
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentUpdates.map((novel) => (
                <tr
                  key={novel.id}
                  className="hover:bg-amber-50/40 transition-colors"
                >
                  <td className="py-2.5 px-3 text-xs text-gray-500">
                    [{novel.category}]
                  </td>
                  <td className="py-2.5 px-3 font-medium">
                    <Link
                      href={`/book/${novel.id}`}
                      className="text-gray-900 hover:text-amber-600"
                    >
                      {novel.title}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3">
                    <Link
                      href={`/book/${novel.id}/${novel.latestChapter.id}`}
                      className="text-gray-600 hover:text-amber-600 text-xs sm:text-sm"
                    >
                      {novel.latestChapter.title}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-gray-500">
                    {novel.author}
                  </td>
                  <td className="py-2.5 px-3 text-xs hidden sm:table-cell">
                    <span
                      className={
                        novel.status === 'completed'
                          ? 'text-orange-600'
                          : 'text-emerald-600'
                      }
                    >
                      {novel.status === 'completed' ? '已完結' : '連載中'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-gray-400 text-right">
                    {novel.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}