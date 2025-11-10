"use client";
import { useState, useEffect, ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type LayoutMode = "flex" | "block";

interface GazeButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  style?: React.CSSProperties;
  onClick: () => void;
  className?: string;
  layoutMode?: LayoutMode;
}

export default function GazeButton({
  children,
  style,
  onClick,
  className,
  layoutMode = "flex",
  onMouseEnter: externalMouseEnter,
  onMouseLeave: externalMouseLeave,
  disabled,
  ...props
}: GazeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isHovered || disabled) {
      setProgress(0);
      return;
    }

    let elapsedTime = 0;
    const dwellInterval = 1500;
    const step = 50;

    const timer = setInterval(() => {
      elapsedTime += step;
      setProgress(Math.min((elapsedTime / dwellInterval) * 100, 100));

      if (elapsedTime >= dwellInterval) {
        clearInterval(timer);
        setIsHovered(false);
        setProgress(100);
        onClick?.();
      }
    }, step);

    return () => {
      clearInterval(timer);
      setProgress(0);
    };
  }, [isHovered, disabled, onClick]);

  const handleMouseEnter = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      externalMouseEnter?.(event);
      return;
    }
    setIsHovered(true);
    externalMouseEnter?.(event);
  };

  const handleMouseLeave = (event: ReactMouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    externalMouseLeave?.(event);
  };

  const baseLayoutStyles: React.CSSProperties =
    layoutMode === "flex"
      ? { display: "flex", alignItems: "center", justifyContent: "center" }
      : { display: "block", width: "100%" };

  return (
    <motion.button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseLayoutStyles,
        position: "relative",
        ...style,
      }}
      className={className}
      whileHover={{ scale: layoutMode === "flex" ? 1.05 : 1.01 }}
      whileTap={{ scale: layoutMode === "flex" ? 0.95 : 0.99 }}
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
          borderRadius: "999px",
          zIndex: 1,
        }}
      />
    </motion.button>
  );
}