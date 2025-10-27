"use client";
import { useState, useEffect, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GazeButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  style?: React.CSSProperties;
  onClick: () => void;
  className?: string;
}

export default function GazeButton({
  children,
  style,
  onClick,
  className,
  ...props
}: GazeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isHovered) {
      let elapsedTime = 0;
      timer = setInterval(() => {
        elapsedTime += 50;
        setProgress((elapsedTime / 1500) * 100);

        if (elapsedTime >= 1500) {
			//   clearInterval(timer);
			elapsedTime = -1000;
          handleHoverActivate();
        }
      }, 50);
    } else {
      if (timer) {
        clearInterval(timer);
      }
      setProgress(0);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isHovered]);

  const handleHoverActivate = () => {
     if (onClick) onClick(); 
  };

  return (
    <motion.button
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
          width: '${progress}%',
          height: "5px",
          backgroundColor: "#adc6ff",
          transition: "width 0.05s ease-out",
          zIndex: 1,
        }}
      />
    </motion.button>
  );
}