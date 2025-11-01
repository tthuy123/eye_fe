// src/app/games/catch-the-bubbles/page.tsx
"use client";

// 1. THÊM "useRef" VÀO IMPORT
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import webgazer from "webgazer";

// (Các type Bubble, PoppingBubble, hàm random không đổi)
type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
};
type PoppingBubble = {
  id: number;
  x: number;
  y: number;
  size: number;
};
const random = (min: number, max: number) => Math.random() * (max - min) + min;

const GAZE_DURATION = 500; // Tăng lên 500ms (0.5s) cho dễ chơi

export default function CatchTheBubblesPage() {
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppingBubbles, setPoppingBubbles] = useState<PoppingBubble[]>([]);
  const [gazeTarget, setGazeTarget] = useState<{ id: number; startTime: number } | null>(null);

  // Tải âm thanh (không đổi)
  const popSound = useMemo(() => {
    if (typeof window !== "undefined") {
      return new Audio("/sounds/pop.mp3");
    }
    return null;
  }, []);

  // (addBubble không đổi, vẫn giữ nguyên bản dễ chơi)
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

  // (removeBubble không đổi)
  const removeBubble = useCallback((id: number) => {
    setBubbles((current) => current.filter((b) => b.id !== id));
  }, []);

  // (popBubble không đổi)
  const popBubble = useCallback(
    (id: number, currentX: number, currentY: number, size: number) => {
      const bubbleToPop = bubbles.find(b => b.id === id);
      const isAlreadyPopping = poppingBubbles.find(b => b.id === id);

      if (bubbleToPop && !isAlreadyPopping) { 
        setPoppingBubbles((prev) => [
          ...prev,
          { id, x: currentX, y: currentY, size },
        ]);
        removeBubble(id);
        setScore((s) => s + 1);
        if (popSound) {
          popSound.currentTime = 0;
          popSound.play();
        }
      }
    },
    [bubbles, removeBubble, popSound, poppingBubbles]
  );

  // (Vòng lặp game không đổi, vẫn 2.5s)
  useEffect(() => {
    const bubbleInterval = setInterval(addBubble, 2500); 
    return () => clearInterval(bubbleInterval);
  }, [addBubble]);


  // 2. TẠO REFs ĐỂ GIỮ PHIÊN BẢN MỚI NHẤT CỦA STATE VÀ CALLBACK
  const gazeTargetRef = useRef(gazeTarget);
  gazeTargetRef.current = gazeTarget;

  const popBubbleRef = useRef(popBubble);
  popBubbleRef.current = popBubble;


  // 3. THAY THẾ TOÀN BỘ useEffect "VÒNG LẶP WEBGAZER"
  useEffect(() => {
    let isMounted = true; // Cờ để kiểm tra component còn "sống" không

    // Hàm async để khởi động webgazer
    async function startWebgazer() {
      try {
        // webgazer.showVideoPreview(true).showPredictionPoints(true);
        // webgazer.applyKalmanFilter(true);
        // CHỜ cho webcam sẵn sàng
        await webgazer.begin(); 

        // Chỉ set listener NẾU component còn "sống"
        if (isMounted) {
          webgazer.setGazeListener((data, clock) => {
            // Nếu mất tracking hoặc component đã unmount -> dừng
            if (!data || !isMounted) {
              if (gazeTargetRef.current) setGazeTarget(null);
              return;
            }

            const el = document.elementFromPoint(data.x, data.y);
            if (!el) {
              if (gazeTargetRef.current) setGazeTarget(null);
              return;
            }

            const bubbleIdAttr = el.getAttribute("data-bubble-id");
            
            if (bubbleIdAttr) {
              const numericId = parseInt(bubbleIdAttr, 10);

              // LUÔN DÙNG "ref.current" để lấy state MỚI NHẤT
              if (gazeTargetRef.current && gazeTargetRef.current.id === numericId) {
                const duration = clock - gazeTargetRef.current.startTime;
                
                if (duration >= GAZE_DURATION) {
                  const rect = el.getBoundingClientRect();
                  // LUÔN DÙNG "ref.current" để gọi callback MỚI NHẤT
                  popBubbleRef.current(numericId, rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width);
                  setGazeTarget(null);
                }
              } else {
                setGazeTarget({ id: numericId, startTime: clock });
              }
            } else {
              if (gazeTargetRef.current) setGazeTarget(null);
            }
          });
        }
      } catch (err) {
        console.error("WebGazer failed to start:", err);
        alert("Không thể khởi động webcam. Vui lòng kiểm tra quyền truy cập.");
      }
    }

    startWebgazer();

    // Dọn dẹp (Cleanup function)
    return () => {
      isMounted = false; // Đánh dấu component đã unmount
      if (webgazer) {
        webgazer.end(); // Tắt webcam 1 lần DUY NHẤT
      }
    };
  }, []); // <-- 4. ĐỔI DEPENDENCY THÀNH MẢNG RỖNG []


  // (Phần return JSX không có gì thay đổi)
  return (
    <main className="relative min-h-[100dvh] bg-[#F5E9DC] text-zinc-900 overflow-hidden">
      {/* Lớp UI (nằm trên) */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <Link
          href="/games"
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#D93636] hover:bg-[#C02E2E] text-white text-lg sm:text-xl font-bold py-4 px-6 sm:px-8 mb-8 transition duration-200 shadow-lg"
        >
          <ArrowLeft size={30} />
        </Link>

        <header className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
            Catch the Bubbles
          </h1>
          <p className="mt-4 text-xl text-zinc-700">
            Nhìn vào bong bóng để làm nổ!
          </p>
          <div className="text-4xl font-bold mt-4 p-4 bg-white/50 rounded-lg inline-block">
            Score: {score}
          </div>
        </header>
      </div>

      {/* Lớp Game (nằm dưới) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              data-bubble-id={bubble.id}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute cursor-pointer"
              style={{
                left: `${bubble.x}%`,
                width: bubble.size,
                height: bubble.size,
              }}
              initial={{ y: `${window.innerHeight}px`, opacity: 0.8 }} 
              animate={{ y: "-150px" }} 
              transition={{
                duration: bubble.duration,
                ease: "linear",
              }}
              onClick={(e) => { 
                const target = e.currentTarget;
                const rect = target.getBoundingClientRect();
                popBubble(bubble.id, rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width);
              }}
              onAnimationComplete={() => removeBubble(bubble.id)}
            >
              <div className="w-full h-full rounded-full bg-cyan-400/50 border-2 border-cyan-200/80" />
              <div
                className="absolute top-[15%] left-[10%] w-1/4 h-1/4 rounded-full bg-white/70"
                style={{ transform: "rotate(-30deg)" }}
              
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {poppingBubbles.map((pBubble) => (
            <PopEffect key={`pop-${pBubble.id}`} {...pBubble} onComplete={() => setPoppingBubbles(prev => prev.filter(b => b.id !== pBubble.id))} />
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}

// (Component PopEffect không đổi)
function PopEffect({ x, y, size, onComplete }: PoppingBubble & { onComplete: () => void }) {
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
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: Math.cos(p.angle * Math.PI / 180) * p.speed,
            y: Math.sin(p.angle * Math.PI / 180) * p.speed,
            opacity: 0,
            scale: 0.5,
          }}
          transition={{
            duration: p.duration,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
}