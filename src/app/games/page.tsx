// src/app/games/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import GazeButton from "@/component/gazeButton";
import { FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <main className="min-h-[100dvh] bg-[#F5E9DC] text-zinc-900">
      {/* Home button */}
      <GazeButton
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push("/")}
        className="absolute top-5 left-10 p-6 sm:p-8 rounded-full bg-gray-200 text-black text-4xl sm:text-5xl shadow-lg transform transition-transform duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
      >
        <FaHome />
      </GazeButton>

      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#D93636]">
          GAME CENTER
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg">
          Chọn một trò chơi để bắt đầu. Chúc bạn chơi vui vẻ!
        </p>
      </header>

      {/* Game grid */}
      <section
        aria-label="Danh sách trò chơi"
        className="mx-auto max-w-6xl px-4 sm:px-6 pb-16"
      >
        <ul className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <li>
            <GameCard
              title="Catch the Bubbles"
              description="Nhìn vào bong bóng để làm nổ và ghi điểm!"
              href="/games/catch-the-bubbles"
              emoji="🫧"
              previewImageUrl="/images/preview-bubbles.png"
            />
          </li>
          <li>
            <GameCard
              title="Look & Match"
              description="Nối từ với hình ảnh tương ứng"
              href="/games/look-match"
              emoji="🔤"
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
  previewImageUrl,
}: {
  title: string;
  description: string;
  href: string;
  emoji?: string;
  previewImageUrl: string;
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <article className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 flex flex-col h-full">
        {/* Red header */}
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

        {/* Preview image */}
        <div className="relative w-full aspect-video bg-[#F5E9DC]">
          <Image
            src={previewImageUrl}
            alt={`Xem trước game ${title}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Description + GazeButton */}
        <div className="px-6 sm:px-8 pb-6 pt-6 flex flex-col justify-between flex-grow">
          <p className="text-sm sm:text-base text-zinc-700 max-w-prose">
            {description}
          </p>

          {/* GazeButton thay cho nút thường */}
          <GazeButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(href)}
            className="mt-6 w-full rounded-2xl bg-[#D93636] hover:bg-[#C02E2E] active:bg-[#A82828] text-white text-lg sm:text-xl font-bold py-5 sm:py-6 shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D93636]/40 transition"
          >
            BẮT ĐẦU CHƠI
          </GazeButton>
        </div>

        {/* focus ring */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-focus-visible:ring-4 group-focus-visible:ring-[#D93636]/40"></div>
      </article>
    </motion.div>
  );
}
