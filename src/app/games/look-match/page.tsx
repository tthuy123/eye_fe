// src/app/games/look-match/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion"; // <-- 1. IMPORT THÊM
import { levels, type Pair } from "./data";

// Hàm xáo trộn mảng
function shuffleArray(array: any[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Đếm tổng số level có trong file data
const totalLevels = Object.keys(levels).length;
const LEVEL_UP_DURATION = 2000; // 2 giây

export default function LookAndMatchPage() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  // 2. THÊM STATE MỚI CHO MODAL
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  // Lấy dữ liệu cho level hiện tại
  const currentLevelData = useMemo(() => {
    const levelKey = ((level - 1) % totalLevels) + 1;
    return levels[levelKey as keyof typeof levels];
  }, [level]);

  // Danh sách các cặp từ/hình của màn này
  const [imageItems, setImageItems] = useState<Pair[]>([]);
  const [wordItems, setWordItems] = useState<Pair[]>([]);

  // Các lựa chọn hiện tại của người chơi
  const [selectedImage, setSelectedImage] = useState<Pair | null>(null);
  const [selectedWord, setSelectedWord] = useState<Pair | null>(null);

  // Các cặp đã ghép đúng
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

  // Trạng thái kiểm tra
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  // Khởi tạo/tải level mới
  useEffect(() => {
    startNewLevel();
  }, [level, currentLevelData]);

  // Logic chính: Kiểm tra khi người chơi đã chọn cả 2
  useEffect(() => {
    if (selectedImage && selectedWord) {
      if (selectedImage.id === selectedWord.id) {
        setStatus("correct");
        setMatchedPairs((prev) => [...prev, selectedImage.id]);
        setScore((s) => s + 1);
      } else {
        setStatus("wrong");
      }

      const timer = setTimeout(() => {
        setSelectedImage(null);
        setSelectedWord(null);
        setStatus("idle");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedImage, selectedWord]);

  // 3. CẬP NHẬT LOGIC QUA MÀN
  useEffect(() => {
    // Chỉ kích hoạt khi đã có dữ liệu và đã ghép đủ
    if (
      currentLevelData.length > 0 &&
      matchedPairs.length === currentLevelData.length
    ) {
      // 1. Hiển thị modal
      setShowLevelUpModal(true);

      // 2. Đặt hẹn giờ 5 giây để chuyển level
      const levelUpTimer = setTimeout(() => {
        setShowLevelUpModal(false); // Ẩn modal
        setLevel((l) => l + 1);      // Tăng level
        setMatchedPairs([]);      // Reset các cặp đã ghép
      }, LEVEL_UP_DURATION); // 5 giây

      // 3. Dọn dẹp
      return () => clearTimeout(levelUpTimer);
    }
  }, [matchedPairs, level, currentLevelData]);

  // Hàm bắt đầu màn chơi mới
  const startNewLevel = () => {
    setImageItems(currentLevelData);
    setWordItems(shuffleArray(currentLevelData));
  };

  // Hàm xử lý khi chọn
  const handleSelectImage = (item: Pair) => {
    if (status !== "idle" || matchedPairs.includes(item.id) || selectedImage)
      return;
    setSelectedImage(item);
  };

  const handleSelectWord = (item: Pair) => {
    if (status !== "idle" || matchedPairs.includes(item.id) || selectedWord)
      return;
    setSelectedWord(item);
  };

  // Hàm lấy style cho các ô (để hiển thị hiệu ứng)
  const getItemClass = (item: Pair, type: "image" | "word") => {
    const layoutClass = "p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 flex items-center justify-center h-28";
    let colorClass = "";

    if (matchedPairs.includes(item.id)) {
      colorClass = "bg-green-900 border-green-700 text-white opacity-50 cursor-not-allowed";
    }
    else if ((type === "image" && selectedImage?.id === item.id && status === "correct") || (type === "word" && selectedWord?.id === item.id && status === "correct")) {
      colorClass = "bg-green-700 border-green-500 ring-4 ring-green-400 text-white";
    }
    else if ((type === "image" && selectedImage?.id === item.id && status === "wrong") || (type === "word" && selectedWord?.id === item.id && status === "wrong")) {
      colorClass = "bg-red-700 border-red-500 ring-4 ring-red-400 text-white";
    }
    else if ((type === "image" && selectedImage?.id === item.id) || (type === "word" && selectedWord?.id === item.id)) {
      colorClass = "bg-[#D93636] border-blue-500 ring-4 ring-blue-400 text-white";
    }
    else {
      colorClass = "bg-[#D93636] border-[#D93636] hover:bg-[#C02E2E] text-white";
    }
    return `${layoutClass} ${colorClass}`;
  };

  return (
    <main className="min-h-[100dvh] bg-[#F5E9DC] text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {/* Nút quay lại */}
        <Link
          href="/games"
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#D93636] hover:bg-[#C02E2E] text-white text-lg sm:text-xl font-bold py-4 px-6 sm:px-8 mb-0 transition duration-200 shadow-lg"
        >
          <ArrowLeft size={30} />
        </Link> 

        {/* Tiêu đề game */}
        <header className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
            Look & Match
          </h1>
          <p className="mt-2 text-xl text-zinc-700">
            Ghép hình với từ tương ứng.
          </p>
          <div className="text-2xl font-bold mt-4">
            Score: {score} | Level: {level}
          </div>
        </header>

        {/* Khu vực game */}
        <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Cột 1: Hình ảnh (Emoji) */}
          <ul className="space-y-4">
            {imageItems.map((item) => (
              <li
                key={item.id}
                className={getItemClass(item, "image")}
                onClick={() => handleSelectImage(item)}
              >
                <span className="text-6xl">{item.emoji}</span>
              </li>
            ))}
          </ul>

          {/* Cột 2: Từ ngữ */}
          <ul className="space-y-4">
            {wordItems.map((item) => (
              <li
                key={item.id}
                className={getItemClass(item, "word")}
                onClick={() => handleSelectWord(item)}
              >
                <span className="text-4xl font-semibold">{item.word}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 4. HIỂN THỊ MODAL KHI ĐẾN ĐIỀU KIỆN */}
        {showLevelUpModal && (
          <LevelUpModal 
            level={level} 
            duration={LEVEL_UP_DURATION} 
          />
        )}
      </div>
    </main>
  );
}

// 4. COMPONENT MODAL MỚI (đặt ở cuối file)
function LevelUpModal({ level, duration }: { level: number, duration: number }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        // Hiệu ứng của framer-motion
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm text-center text-zinc-900"
      >
        <span className="text-6xl" role="img" aria-label="Trophy">🏆</span>
        <h2 className="text-3xl font-bold mt-4">
          Chúc mừng!
        </h2>
        <p className="text-lg mt-2">
          Bạn đã hoàn thành Level {level}!
        </p>
        <p className="text-sm text-zinc-600 mt-4 animate-pulse">
          Đang tải level tiếp theo...
        </p>
      </motion.div>
    </div>
  );
}