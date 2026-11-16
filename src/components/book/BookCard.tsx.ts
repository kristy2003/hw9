import Link from 'next/link';
import { Novel } from '@/types/novel';

interface BookCardProps {
  novel: Novel;
}

export function BookCard({ novel }: BookCardProps) {
  const isCompleted = novel.status === 'completed';

  return (
    <div className="flex gap-3 p-3 bg-white border border-gray-200 rounded hover:border-amber-500 transition-colors">
      {/* 封面圖 (3:4 比例) */}
      <Link href={`/book/${novel.id}`} className="shrink-0">
        <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden border border-gray-200 flex items-center justify-center text-xs text-gray-400">
          <span>{novel.category}</span>
        </div>
      </Link>

      {/* 書籍資訊區 */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/book/${novel.id}`}
              className="font-bold text-gray-900 hover:text-amber-600 truncate text-base"
            >
              {novel.title}
            </Link>
            <span
              className={`shrink-0 text-xs px-1.5 py-0.5 rounded font-medium ${
                isCompleted
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {isCompleted ? '已完結' : '連載中'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span>作者：{novel.author}</span>
            <span>|</span>
            <span>分類：{novel.category}</span>
            <span>|</span>
            <span className="text-amber-600 font-semibold">
              推薦 {novel.recommendScore} 分
            </span>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 mt-1.5 leading-relaxed">
            {novel.description}
          </p>
        </div>

        {/* 底部標籤與最新章節 */}
        <div className="flex items-center justify-between text-xs mt-2 pt-1.5 border-t border-gray-100">
          <div className="flex gap-1 overflow-hidden">
            {novel.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
          <Link
            href={`/book/${novel.id}/${novel.latestChapter.id}`}
            className="text-gray-500 hover:text-amber-600 truncate max-w-[180px]"
          >
            最新：{novel.latestChapter.title}
          </Link>
        </div>
      </div>
    </div>
  );
}