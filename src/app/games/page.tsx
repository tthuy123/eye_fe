// src/app/games/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image"; // <-- 1. IMPORT IMAGE

export default function Page() {
  return (
    <main className="min-h-[100dvh] bg-[#F5E9DC] text-zinc-900">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 sm:px-6 py-12 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          GAME CENTER
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg">
          Chọn một trò chơi để bắt đầu. Chúc bạn chơi vui vẻ!
        </p>
      </header>

      {/* Game grid */}
      <section aria-label="Danh sách trò chơi" className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <ul className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <li>
            <GameCard
              title="Catch the Bubbles"
              description="Nhìn vào bong bóng để làm nổ, tích điểm và hiệu ứng vui nhộn."
              href="/games/catch-the-bubbles"
              emoji="🫧"
              // 4. TRUYỀN PROP ẢNH VÀO CARD
              previewImageUrl="/images/preview-bubbles.png"
            />
          </li>
          <li>
            <GameCard
              title="Look & Match"
              description="Nhìn lần lượt vào hình và từ tương ứng trong 3s để ghép đúng."
              href="/games/look-match"
              emoji="🔤"
              // 4. TRUYỀN PROP ẢNH VÀO CARD
              previewImageUrl="/images/look_match.png"
            />
          </li>
        </ul>
      </section>
    </main>
  );
}

function GameCard({
  title,
  description,
  href,
  emoji,
  previewImageUrl, // <-- 2. THÊM PROP previewImageUrl
}: {
  title: string;
  description: string;
  href: string;
  emoji?: string;
  previewImageUrl: string; // <-- 2. THÊM PROP previewImageUrl
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Link
        href={href}
        className="group block focus:outline-none"
        aria-label={`Chơi ${title}`}
      >
        <article
          className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
        >
          {/* Bold red title band */}
          <div className="bg-[#D93636] text-white">
            <div className="flex items-center justify-between px-6 py-5 sm:px-8">
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                {title}
              </h2>
              <span className="text-3xl sm:text-4xl" aria-hidden>
                {emoji}
              </span>
            </div>
          </div>

          {/* 3. THAY THẾ GRID LEVEL BẰNG IMAGE */}
          <div className="relative w-full aspect-video bg-[#F5E9DC]">
            <Image
              src={previewImageUrl}
              alt={`Xem trước game ${title}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* KẾT THÚC PHẦN THAY THẾ */}

          {/* Footer with large primary button */}
          <div className="px-6 sm:px-8 pb-6 pt-6"> {/* Thêm pt-6 để tạo khoảng cách */}
            <p className="mt-4 text-sm sm:text-base text-zinc-700 max-w-prose">
              {description}
            </p>

            <button
              className="mt-6 w-full rounded-2xl bg-[#D93636] hover:bg-[#C02E2E] active:bg-[#A82828] text-white text-lg sm:text-xl font-bold py-5 sm:py-6 shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D93636]/40 transition"
              style={{ minHeight: 56 }}
              aria-label={`Bắt đầu ${title}`}
            >
              BẮT ĐẦU CHƠI
            </button>

            <p className="sr-only">Nút lớn, tối thiểu 56px chiều cao, hỗ trợ Enter/Space khi dùng bàn phím.</p>
          </div>

          {/* focus ring for the whole card when tabbed */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-focus-visible:ring-4 group-focus-visible:ring-[#D93636]/40"></div>
        </article>
      </Link>
    </motion.div>
  );
}