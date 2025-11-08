// src/app/games/look-match/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { levels, type Pair } from "./data";
import GazeButton from "@/component/gazeButton";
import { useRouter } from "next/navigation";

// Xáo trộn
function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

const totalLevels = Object.keys(levels).length;
const LEVEL_UP_DURATION = 2000; // 2s

export default function LookAndMatchPage() {
  const router = useRouter();

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  // Data màn hiện tại
  const currentLevelData = useMemo(() => {
    const key = ((level - 1) % totalLevels) + 1;
    return levels[key as keyof typeof levels];
  }, [level]);

  // Danh sách
  const [imageItems, setImageItems] = useState<Pair[]>([]);
  const [wordItems, setWordItems] = useState<Pair[]>([]);

  // Lựa chọn hiện tại
  const [selectedImage, setSelectedImage] = useState<Pair | null>(null);
  const [selectedWord, setSelectedWord] = useState<Pair | null>(null);

  // Ghép đúng
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

  // Trạng thái kiểm tra
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  // Khởi tạo / tải level
  useEffect(() => {
    startNewLevel();
  }, [level, currentLevelData]);

  // Kiểm tra khi đã chọn 2 bên
  useEffect(() => {
    if (selectedImage && selectedWord) {
      if (selectedImage.id === selectedWord.id) {
        setStatus("correct");
        setMatchedPairs((p) => [...p, selectedImage.id]);
        setScore((s) => s + 1);
      } else setStatus("wrong");

      const t = setTimeout(() => {
        setSelectedImage(null);
        setSelectedWord(null);
        setStatus("idle");
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [selectedImage, selectedWord]);

  // Qua màn
  useEffect(() => {
    if (currentLevelData.length > 0 && matchedPairs.length === currentLevelData.length) {
      setShowLevelUpModal(true);
      const t = setTimeout(() => {
        setShowLevelUpModal(false);
        setLevel((l) => l + 1);
        setMatchedPairs([]);
      }, LEVEL_UP_DURATION);
      return () => clearTimeout(t);
    }
  }, [matchedPairs, currentLevelData]);

  const startNewLevel = () => {
    setImageItems(currentLevelData);
    setWordItems(shuffleArray(currentLevelData));
  };

  const handleSelectImage = (item: Pair) => {
    if (status !== "idle" || matchedPairs.includes(item.id) || selectedImage) return;
    setSelectedImage(item);
  };

  const handleSelectWord = (item: Pair) => {
    if (status !== "idle" || matchedPairs.includes(item.id) || selectedWord) return;
    setSelectedWord(item);
  };

  // Style cho các cell
  const getItemClass = (item: Pair, type: "image" | "word") => {
    const layout = "p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 flex items-center justify-center h-28 select-none";
    let color = "";
    if (matchedPairs.includes(item.id)) {
      color = "bg-green-900 border-green-700 text-white opacity-50 cursor-not-allowed";
    } else if (
      (type === "image" && selectedImage?.id === item.id && status === "correct") ||
      (type === "word" && selectedWord?.id === item.id && status === "correct")
    ) {
      color = "bg-green-700 border-green-500 ring-4 ring-green-400 text-white";
    } else if (
      (type === "image" && selectedImage?.id === item.id && status === "wrong") ||
      (type === "word" && selectedWord?.id === item.id && status === "wrong")
    ) {
      color = "bg-red-700 border-red-500 ring-4 ring-red-400 text-white";
    } else if (
      (type === "image" && selectedImage?.id === item.id) ||
      (type === "word" && selectedWord?.id === item.id)
    ) {
      color = "bg-[#D93636] border-blue-500 ring-4 ring-blue-400 text-white";
    } else {
      color = "bg-[#D93636] border-[#D93636] hover:bg-[#C02E2E] text-white";
    }
    return `${layout} ${color}`;
  };

  return (
    <main className="min-h-[100dvh] bg-[#F5E9DC] text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {/* Nút quay lại (GazeButton) */}
        <GazeButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/games")}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#D93636] hover:bg-[#C02E2E] text-white text-lg sm:text-xl font-bold py-4 px-6 sm:px-8 mb-0 transition duration-200 shadow-lg"
          aria-label="Quay lại Game Center"
        >
          <ArrowLeft size={30} />
        </GazeButton>

        {/* Tiêu đề */}
        <header className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
            Look & Match
          </h1>
          <p className="mt-2 text-xl text-zinc-700">Ghép hình với từ tương ứng.</p>
          <div className="text-2xl font-bold mt-4">Score: {score} | Level: {level}</div>
        </header>

        {/* Khu vực game */}
       {/* Khu vực game */}
<div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
  {/* Cột 1: Hình */}
  <ul className="grid gap-4">
    {imageItems.map((item) => (
      <li key={item.id} className="w-full">
        <GazeButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectImage(item)}
          className={`
            ${getItemClass(item, "image")}
            w-full aspect-square flex items-center justify-center 
            text-6xl font-semibold select-none
          `}
          aria-label={`Chọn hình ${item.word}`}
        >
          {item.emoji}
        </GazeButton>
      </li>
    ))}
  </ul>

  {/* Cột 2: Từ */}
  <ul className="grid gap-4">
    {wordItems.map((item) => (
      <li key={item.id} className="w-full">
        <GazeButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectWord(item)}
          className={`
            ${getItemClass(item, "word")}
            w-full aspect-square flex items-center justify-center 
            text-2xl sm:text-3xl font-bold select-none
          `}
          aria-label={`Chọn từ ${item.word}`}
        >
          {item.word}
        </GazeButton>
      </li>
    ))}
  </ul>
</div>
      </div>

      {/* Modal lên level */}
      {showLevelUpModal && <LevelUpModal level={level} duration={LEVEL_UP_DURATION} />}
    </main>
  );
}

// Modal
function LevelUpModal({ level }: { level: number; duration: number }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm text-center text-zinc-900"
      >
        <span className="text-6xl" role="img" aria-label="Trophy">
          🏆
        </span>
        <h2 className="text-3xl font-bold mt-4">Chúc mừng!</h2>
        <p className="text-lg mt-2">Bạn đã hoàn thành Level {level}!</p>
        <p className="text-sm text-zinc-600 mt-4 animate-pulse">
          Đang tải level tiếp theo...
        </p>
      </motion.div>
    </div>
  );
}
