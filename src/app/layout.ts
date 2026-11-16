import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: '小說推薦網 - 精選玄幻、言情、都市、穿越小說閱讀與推薦',
  description:
    '提供最新熱門網路小說推薦、即時更新章節目錄、全本完本排行榜，打造純淨舒適的線上閱讀體驗。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-800 antialiased">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-center text-xs text-gray-500">
          <div className="max-w-6xl mx-auto px-4 space-y-1">
            <p>小說推薦網 © 2026 All Rights Reserved.</p>
            <p>
              本站僅提供小說推薦索引與閱讀介面展示，所有作品版權歸原作者與原出版社所有。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}