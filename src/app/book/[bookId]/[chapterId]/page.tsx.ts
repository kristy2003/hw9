import { notFound } from 'next/navigation';
import { MOCK_NOVELS } from '@/lib/mock-data';
import { Chapter } from '@/types/novel';
import { ReaderView } from '@/components/reader/ReaderView';

interface ChapterPageProps {
  params: Promise<{ bookId: string; chapterId: string }>;
}

// 輔助函式：根據 chapterId 生成對應的測試章節內容
function getMockChapterContent(
  novelId: string,
  novelTitle: string,
  chapterId: string,
  latestIndex: number,
  latestTitle: string
): {
  chapter: Chapter;
  prevChapterId: string | null;
  nextChapterId: string | null;
} | null {
  // 解析 ch-412 中的數字序號
  const match = chapterId.match(/^ch-(\d+)$/);
  if (!match) return null;

  const index = parseInt(match[1], 10);
  if (index < 1 || index > latestIndex) return null;

  const isLatest = index === latestIndex;
  const title = isLatest
    ? latestTitle
    : `第${index}章 風起雲湧的徵兆（測試章節）`;

  const sampleContent = `
夜色如墨，冷風吹過青石板鋪就的長街，捲起幾片枯黃的落葉。
林默站在閣樓窗前，望著遠處天際那道若隱若現的金色光柱，眉頭微微皺起。自從三天前覺醒儀式結束後，整座城市的靈氣濃度便以一種不可思議的速度攀升。
「看來，比預想中來得還要快一些。」他低聲自語，指尖輕輕摩挲著袖口內側那枚溫熱的古樸玉佩。
就在剛才，腦海中的圖鑑系統再次發出了清脆的提示音，一道淡藍色的光幕隨即在視網膜上展開，上面密密麻麻記錄著周圍方圓十里內所有異獸的氣息波動。
若是一般的初階御獸師，面對如此龐雜的精神力反饋，恐怕不出半刻鐘就會頭痛欲裂；但憑藉著兩世為人的靈魂強度，林默卻顯得游刃有餘，甚至還能從中精準鎖定那道最為隱晦的波動源頭。
「城西廢棄礦區……有意思，竟然是一頭即將完成二次蛻變的暗影魔狼。」
林默嘴角揚起一抹弧度，轉身抓起桌上的長劍與背包，推開房門大步走入夜色之中。無論前方等待著他的是機遇還是兇險，這一世，他絕不會再讓任何遺憾重演。
（本章為《${novelTitle}》系統自動生成的展示正文，正式上線後將串接資料庫顯示完整章節內容。）
  `.trim();

  return {
    chapter: {
      id: chapterId,
      novelId,
      index,
      title,
      content: sampleContent,
      wordCount: sampleContent.length,
      updatedAt: '剛剛',
    },
    prevChapterId: index > 1 ? `ch-${index - 1}` : null,
    nextChapterId: index < latestIndex ? `ch-${index + 1}` : null,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { bookId, chapterId } = await params;

  const novel = MOCK_NOVELS.find((item) => item.id === bookId);
  if (!novel) {
    notFound();
  }

  const result = getMockChapterContent(
    novel.id,
    novel.title,
    chapterId,
    novel.latestChapter.index,
    novel.latestChapter.title
  );

  if (!result) {
    notFound();
  }

  return (
    <ReaderView
      novel={novel}
      chapter={result.chapter}
      prevChapterId={result.prevChapterId}
      nextChapterId={result.nextChapterId}
    />
  );
}