import { useState } from "react";
import GazeButton from "./gazeButton";

export default function Search () {
	const layout = [
		["E", "A", "N", "G", "H", "T", "O", "I", "U"],
		["C", "D", "L", "M", "P", "Q", "R", "S", "U"],
		["B", "F", "J", "K", "V", "W", "X", "Y", "Z"],
	];

	const [inputText, setInputText] = useState("");

	const handleAddChar = (char: string) => {
		setInputText((prev) => prev + char);
	};

	const handleDelete = () => {
		setInputText((prev) => prev.slice(0, -1));
	};

	const handleSearch = () => {
		// gọi API tìm sách bằng từ khóa inputText
		// searchBooks(inputText);
	};

	return (
		<div className="flex flex-col items-center space-y-2">
			<div className="border p-2 w-[300px] bg-white text-black text-lg mb-2">
				{inputText}
			</div>
			{layout.map((row, rowIndex) => (
				<div key={rowIndex} className="flex space-x-1">
					{row.map((char) => (
						<GazeButton
							key={char}
							className="w-10 h-10 bg-blue-200 rounded-md"
							onClick={() => handleAddChar(char)}
						>
							{char}
						</GazeButton>
					))}
				</div>
			))}

			{/* Special keys */}
			<div className="flex space-x-1 mt-2">
				<GazeButton className="px-4 py-2 bg-gray-200" onClick={() => handleAddChar(" ")}>
					SPACE
				</GazeButton>
				<GazeButton className="px-4 py-2 bg-red-200" onClick={handleDelete}>
					DEL
				</GazeButton>
				<GazeButton className="px-4 py-2 bg-green-300" onClick={handleSearch}>
					SEARCH
				</GazeButton>
			</div>
		</div>
	);
}
  