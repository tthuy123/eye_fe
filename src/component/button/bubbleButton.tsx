"use client";
import { useState, useEffect, ReactNode, useRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GazeButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  dwellMs?: number; // thời gian “nhìn/hover” để auto-click
}

export default function GazeButton({
  children,
  style,
  onClick,
  className,
  dwellMs = 1500,
  ...props
}: GazeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isHovered) {
      let elapsedTime = 0;
      timer = setInterval(() => {
        elapsedTime += 50;
        setProgress(Math.min(100, (elapsedTime / dwellMs) * 100));
        if (elapsedTime >= dwellMs) {
          // reset để có thể kích hoạt liên tiếp nếu vẫn còn hover
          elapsedTime = 0;
          setProgress(0);
          // Click thật để React tạo SyntheticEvent có currentTarget hợp lệ
          buttonRef.current?.click();
        }
      }, 50);
    } else {
      if (timer) clearInterval(timer);
      setProgress(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isHovered, dwellMs]);

  return (
    <motion.button
      ref={buttonRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: `${progress}%`,
          height: "5px",
          backgroundColor: "#adc6ff",
          transition: "width 0.05s ease-out",
          zIndex: 1,
          pointerEvents: "none",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      />
    </motion.button>
  );
}
