import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_NOVELS } from '@/lib/mock-data';
import { ChapterSummary } from '@/types/novel';
import {
  BookActionButtons,
  ChapterCatalog,
} from '@/components/book/BookDetailActions';

interface BookDetailPageProps {
  params: Promise<{ bookId: string }>;
}

// 輔助函式：根據假資料自動生成完整測試目錄（包含最新章節）
function generateMockChapters(
  latestChapter: ChapterSummary,
  totalDisplayCount = 24
): ChapterSummary[] {
  const chapters: ChapterSummary[] = [];
  const startIdx = Math.max(1, latestChapter.index - totalDisplayCount + 1);

  for (let i = startIdx; i < latestChapter.index; i++) {
    chapters.push({
      id: `ch-${i}`,
      index: i,
      title: `第${i}章 風起雲湧的徵兆（測試章節）`,
      updatedAt: '3天前',
    });
  }

  chapters.push(latestChapter);
  return chapters;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { bookId } = await params;
  const novel = MOCK_NOVELS.find((item) => item.id === bookId);

  if (!novel) {
    notFound();
  }

  const isCompleted = novel.status === 'completed';
  const chapters = generateMockChapters(novel.latestChapter, 30);
  const firstChapter = chapters[0];

  // 格式化字數顯示（例如 1450000 -> 145.0 萬字）
  const formattedWords = `${(novel.wordCount / 10000).toFixed(1)} 萬字`;
  const formattedViews = `${(novel.views / 10000).toFixed(1)} 萬次點擊`;

  return (
    <div className="space-y-6">
      {/* 1. 麵包屑導覽 */}
      <nav className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-amber-600">
          首頁
        </Link>
        <span>/</span>
        <Link
          href={`/category/${encodeURIComponent(novel.category)}`}
          className="hover:text-amber-600"
        >
          {novel.category}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">{novel.title}</span>
      </nav>

      {/* 2. 書籍核心資訊卡片 */}
      <section className="bg-white border border-gray-200 rounded p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* 左側封面圖 (3:4 比例) */}
          <div className="w-36 h-48 sm:w-44 sm:h-60 shrink-0 mx-auto sm:mx-0 bg-gradient-to-br from-zinc-700 to-zinc-900 text-white rounded shadow-sm border border-gray-200 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-xs text-amber-400 tracking-widest mb-2">
              {novel.category}
            </span>
            <p className="font-bold text-base leading-snug line-clamp-3">
              {novel.title}
            </p>
            <span className="text-[11px] text-zinc-400 mt-3">
              {novel.author} 著
            </span>
          </div>

          {/* 右側詳細規格與操作 */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              {/* 書名與狀態徽章 */}
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-gray-900">
                  {novel.title}
                </h1>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    isCompleted
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {isCompleted ? '已完結' : '連載中'}
                </span>
              </div>

              {/* 作者與數據指標列 */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-gray-600 mt-3 pb-3 border-b border-gray-100">
                <span>
                  作者：<strong className="font-medium text-gray-900">{novel.author}</strong>
                </span>
                <span>分類：{novel.category}</span>
                <span>字數：{formattedWords}</span>
                <span>人氣：{formattedViews}</span>
                <span>
                  編輯推薦：
                  <strong className="text-amber-600 font-bold">
                    {novel.recommendScore} 分
                  </strong>
                </span>
              </div>

              {/* 標籤列 */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs text-gray-400">作品標籤：</span>
                {novel.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-amber-50 text-gray-600 hover:text-amber-700 rounded transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* 最新章節提示 */}
              <div className="mt-3 text-xs sm:text-sm bg-gray-50 px-3 py-2 rounded border border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-400 shrink-0">最新章節：</span>
                  <Link
                    href={`/book/${novel.id}/${novel.latestChapter.id}`}
                    className="text-amber-700 hover:underline font-medium truncate"
                  >
                    {novel.latestChapter.title}
                  </Link>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  更新時間：{novel.updatedAt}
                </span>
              </div>
            </div>

            {/* 閱讀與書架按鈕 */}
            <BookActionButtons
              bookId={novel.id}
              firstChapterId={firstChapter.id}
            />
          </div>
        </div>

        {/* 劇情簡介區 */}
        <div className="mt-6 pt-5 border-t border-gray-200">
          <h2 className="text-sm font-bold text-gray-900 mb-2">內容簡介</h2>
          <p className="text-sm text-gray-700 leading-7 whitespace-pre-line">
            {novel.description}
          </p>
        </div>
      </section>

      {/* 3. 三欄式章節目錄 */}
      <ChapterCatalog bookId={novel.id} chapters={chapters} />
    </div>
  );
}