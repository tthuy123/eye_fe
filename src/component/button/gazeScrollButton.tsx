import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import GazeButton from "../gazeButton";
import { useState, useEffect } from "react";

export function GazeScrollButton({
	direction = "down",
	amount = 400,
}: {
	direction?: "up" | "down";
	amount?: number;
}) {
	const [isDisabled, setIsDisabled] = useState(false);

	// Function to check if the button should be disabled
	const checkScroll = () => {
		const scrollPosition = window.scrollY;
		const pageHeight = document.documentElement.scrollHeight;
		const windowHeight = window.innerHeight;

		// Disable the button if at the top or bottom
		if (direction === "down" && scrollPosition + windowHeight >= pageHeight) {
			setIsDisabled(true);
		} else if (direction === "up" && scrollPosition <= 0) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	};

	// Scroll event listener
	useEffect(() => {
		checkScroll();
		window.addEventListener("scroll", checkScroll);

		// Clean up the event listener on component unmount
		return () => {
			window.removeEventListener("scroll", checkScroll);
		};
	}, [direction]);

	const handleScroll = () => {
		if (isDisabled) return; // Prevent scrolling if the button is disabled

		window.scrollBy({
			top: direction === "down" ? amount : -amount,
			behavior: "smooth",
		});
	};

	return (
		<GazeButton
			onClick={handleScroll}
			className={`p-10 rounded-full bg-[#E64A4A] text-white text-2xl shadow-lg transform transition-transform duration-300 hover:scale-110 hover:shadow-xl active:scale-95 
				${isDisabled
					? "opacity-50 cursor-not-allowed"
					: "hover:shadow-xl"
				}`
			}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			disabled={isDisabled}
		>
			{direction === "down" ? <AiOutlineDown /> : <AiOutlineUp />}
		</GazeButton>
	);
}
