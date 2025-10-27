// component/AutoScrollToggle.tsx
import { AiOutlinePause, AiOutlinePlayCircle } from "react-icons/ai";
import GazeButton from "../gazeButton";
import { useEffect, useRef, useState } from "react";

function useAutoScroll(speed = 1) {
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [isAutoScrolling, setAutoScrolling] = useState(false);

	useEffect(() => {
		if (isAutoScrolling) {
			intervalRef.current = setInterval(() => {
				window.scrollBy({ top: speed, behavior: "smooth" });
			}, 50);
		} else {
			if (intervalRef.current) clearInterval(intervalRef.current);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isAutoScrolling, speed]);

	return [isAutoScrolling, setAutoScrolling] as const;
}

export default function AutoScrollToggle() {
	const [isAutoScrolling, setAutoScrolling] = useAutoScroll(1.5);
	
	return (
		<GazeButton
			onClick={() => setAutoScrolling((prev: any) => !prev)}
			className={`p-10 rounded-full text-white text-2xl shadow-lg transform transition-transform duration-300 hover:scale-110 hover:shadow-xl active:scale-95 ${isAutoScrolling ? "bg-red-600" : "bg-green-600"}`}
		>
			{isAutoScrolling ? <AiOutlinePause/> : <AiOutlinePlayCircle />}
		</GazeButton>
	);
}


