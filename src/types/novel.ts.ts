export type NovelStatus = 'ongoing' | 'completed';

export type NovelCategory =
  | '玄幻魔法'
  | '武俠修真'
  | '都市言情'
  | '歷史軍事'
  | '遊戲競技'
  | '科幻靈異'
  | '同人小說'
  | '輕小說';

export interface ChapterSummary {
  id: string;
  index: number;
  title: string;
  updatedAt: string;
}

export interface Chapter extends ChapterSummary {
  novelId: string;
  content: string;
  wordCount: number;
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  category: NovelCategory;
  tags: string[];
  coverUrl: string;
  description: string;
  status: NovelStatus;
  wordCount: number;
  views: number;
  recommendScore: number; // 推薦指數 (0 - 10)
  updatedAt: string;
  latestChapter: ChapterSummary;
}