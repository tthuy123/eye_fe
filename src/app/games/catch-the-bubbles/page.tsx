"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GazeButton from "@/component/button/bubbleButton";

// ===== Types =====
type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
};

type PoppingBubble = {
  id: number;  // mỗi bubble chỉ nổ 1 lần
  x: number;
  y: number;
  size: number;
};

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export default function CatchTheBubblesPage() {
  const router = useRouter();

  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppingBubbles, setPoppingBubbles] = useState<PoppingBubble[]>([]);

  // Âm thanh nổ
  const popSound = useMemo(() => {
    if (typeof window !== "undefined") return new Audio("/sounds/pop.mp3");
    return null;
  }, []);

  // 🔓 Mở-khóa audio trong lần tương tác thật đầu tiên
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  useEffect(() => {
    if (audioUnlocked || !popSound) return;

    const unlock = async () => {
      try {
        const prevVol = popSound.volume;
        popSound.volume = 0;
        await popSound.play();
        popSound.pause();
        popSound.currentTime = 0;
        popSound.volume = prevVol;
        setAudioUnlocked(true);
        removeListeners();
      } catch {
        // có thể thất bại, sẽ thử lại ở lần tương tác kế tiếp
      }
    };

    const removeListeners = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock as any, { capture: true } as any);
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock as any, { once: true, passive: true } as any);

    return removeListeners;
  }, [audioUnlocked, popSound]);

  // Thêm bong bóng mới
  const addBubble = useCallback(() => {
    const newBubble: Bubble = {
      id: Date.now(),
      x: random(5, 95),
      y: window.innerHeight + random(50, 150),
      size: random(80, 160),
      duration: random(15, 25),
    };
    setBubbles((current) => [...current, newBubble]);
  }, []);

  // Pop: mỗi bubble chỉ nổ 1 lần → khi nổ thì xóa luôn khỏi state
  const popBubble = useCallback(
    (id: number, currentX: number, currentY: number, size: number) => {
      const exists = bubbles.some((b) => b.id === id);
      if (!exists) return;

      const alreadyPopping = poppingBubbles.some((b) => b.id === id);
      if (alreadyPopping) return;

      // ✅ Xóa bubble khỏi state NGAY
      setBubbles((prev) => prev.filter((b) => b.id !== id));

      // Tạo hiệu ứng nổ
      setPoppingBubbles((prev) => [...prev, { id, x: currentX, y: currentY, size }]);

      // Cộng điểm
      setScore((s) => s + 1);

      // Phát âm thanh
      if (popSound) {
        popSound.currentTime = 0;
        popSound.play().catch(() => {});
      }
    },
    [bubbles, poppingBubbles, popSound]
  );

  // Sinh bong bóng đều đặn
  useEffect(() => {
    const bubbleInterval = setInterval(addBubble, 2500);
    return () => clearInterval(bubbleInterval);
  }, [addBubble]);

  return (
    <main className="relative min-h-[100dvh] bg-[#F5E9DC] text-zinc-900 overflow-hidden">
      {/* UI trên */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {/* Nút quay lại */}
        <GazeButton
          aria-label="Back"
          dwellMs={900}
          onClick={() => router.push("/games")}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#D93636] hover:bg-[#C02E2E] text-white text-lg sm:text-xl font-bold py-4 px-6 sm:px-8 mb-8 transition duration-200 shadow-lg"
        >
          <ArrowLeft size={30} />
        </GazeButton>

        <header className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
            Catch the Bubbles
          </h1>
          <p className="mt-4 text-xl text-zinc-700">
            Nhìn/giữ chuột để kích hoạt nút hoặc làm nổ bong bóng!
          </p>
          <div className="text-4xl font-bold mt-4 p-4 bg-white/50 rounded-lg inline-block">
            Score: {score}
          </div>
        </header>
      </div>

      {/* Lớp Game */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <GazeButton
              key={bubble.id}
              data-bubble-id={bubble.id}
              className="absolute cursor-pointer"
              style={{
                left: `${bubble.x}%`,
                width: bubble.size,
                height: bubble.size,
              }}
              dwellMs={600}
              // Dùng motion.button để di chuyển bong bóng
              as={motion.button as any}
              initial={{ y: `${(typeof window !== "undefined" ? window.innerHeight : 800)}px`, opacity: 0.8 }}
              animate={{ y: "-150px" }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: bubble.duration, ease: "linear" }}
              // ❌ KHÔNG dùng onAnimationComplete để xóa
              onClick={(e) => {
                const el = e.currentTarget as HTMLButtonElement | null;
                if (!el) return;

                // Ẩn và vô hiệu hoá NGAY để biến mất tức thì, chặn click/dwell lặp
                el.style.visibility = "hidden";
                el.style.pointerEvents = "none";
                el.blur();

                const rect = el.getBoundingClientRect();
                popBubble(
                  bubble.id,
                  rect.x + rect.width / 2,
                  rect.y + rect.height / 2,
                  rect.width
                );
              }}
            >
              <div className="w-full h-full rounded-full bg-cyan-400/50 border-2 border-cyan-200/80" />
              <div
                className="absolute top-[15%] left-[10%] w-1/4 h-1/4 rounded-full bg-white/70"
                style={{ transform: "rotate(-30deg)" }}
              />
            </GazeButton>
          ))}
        </AnimatePresence>

        {/* Hiệu ứng nổ */}
        <AnimatePresence>
          {poppingBubbles.map((pBubble) => (
            <PopEffect
              key={`pop-${pBubble.id}`} // mỗi bubble chỉ nổ một lần → id là duy nhất
              {...pBubble}
              onComplete={() =>
                setPoppingBubbles((prev) => prev.filter((b) => b.id !== pBubble.id))
              }
            />
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}

// ===== Hiệu ứng nổ =====
function PopEffect({
  x,
  y,
  size,
  onComplete,
}: PoppingBubble & { onComplete: () => void }) {
  const particles = useMemo(() => {
    return Array.from({ length: random(5, 8) }).map((_, i) => ({
      id: i,
      x: random(-size / 4, size / 4),
      y: random(-size / 4, size / 4),
      size: random(size / 8, size / 4),
      angle: random(0, 360),
      speed: random(50, 150),
      duration: random(0.5, 1),
    }));
  }, [size]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-cyan-300 to-blue-500"
          style={{ width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.speed,
            y: Math.sin((p.angle * Math.PI) / 180) * p.speed,
            opacity: 0,
            scale: 0.5,
          }}
          transition={{ duration: p.duration, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}
