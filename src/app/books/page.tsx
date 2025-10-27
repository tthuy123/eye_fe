"use client";
import { useEffect, useState } from "react";
import BooksList from "../component/book/booksList";
import GazeButton from "../component/gazeButton";
import Search from "../component/search";
import { AiOutlineLeft } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";

interface Book {
	id: string;
	title: string;
	author?: string;
	coverImage?: string;
	slug: string;
	thumb_url: string;
	name: string;
	chaptersLatest: any;
	category: string; // Added category property
	volumeInfo: {
		categories?: string[];
		[key: string]: any;
	};
}

const DEFAULT_CATEGORIES = [
	"Novel", "Fiction", "Literature",
	"Fantasy", "Mystery", "Romance", "History", "Comics"
];

export default function BooksPage() {
	const router = useRouter();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [books, setBooks] = useState<Book[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const booksPerPage = 4;
	const [searchQuery, setSearchQuery] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [showKeyboard, setShowKeyboard] = useState(false);


	// Fetch books whenever category changes
	useEffect(() => {
		const fetchBooks = async () => {
			setIsLoading(true);
			try {
				const query = selectedCategory || "Novel";
				if (query === "Comics") {
					// // const response = await fetch(
					// // 	`https://api.mangadex.org/manga?limit=20&order[relevance]=desc&includes[]=cover_art`
					// // );
					// const response = await fetch(
					// 	`https://api.mangadex.org/manga?limit=20&title=doraemon&includes[]=cover_art`
					//   );
					const doraemonRes = await fetch(
						`https://api.mangadex.org/manga?limit=10&title=doraemon&includes[]=cover_art`
					);
					const doraemonData = await doraemonRes.json();

					const popularRes = await fetch(
						`https://api.mangadex.org/manga?limit=30&order[followedCount]=desc&includes[]=cover_art`
					);
					const popularData = await popularRes.json();

					const combined = [...doraemonData.data, ...popularData.data];
					shuffle(combined);

					const MAX_WORD_COUNT = 8;

					const data = combined.filter(manga => {
						// const titleObj = manga.attributes?.title || manga.attributes?.altTitles?.find((alt: any) => alt?.en);
						// const title = titleObj?.en || titleObj?.ja || Object.values(titleObj || {})[0] || '';
						const titleObj = manga.attributes?.title;
						let title = titleObj?.en;

						// Nếu không có title en, lấy từ altTitles
						if (!title) {
							title = manga.attributes?.altTitles?.find((alt: any) => alt?.en)?.en;
						}

						// Nếu không có title en hay altTitles, sử dụng title mặc định từ các ngôn ngữ khác
						if (!title) {
							title = titleObj?.ja || Object.values(titleObj || {})[0] || 'No title available';
						}

						const wordCount = title.trim().split(/\s+/).length;
						return wordCount <= MAX_WORD_COUNT;
					});
					// const data = await response.json();
					console.log(data)

					const processedBooks = data?.map((manga: any) => {
						const id = manga.id;
						const attributes = manga.attributes;
						let title = attributes?.title?.en;
						if (!title) {
							const altEn = attributes?.altTitles?.find((alt: any) => alt?.en);
							title = altEn?.en || "Untitled";
						}

						// Tìm cover ảnh từ relationships
						const coverArt = manga.relationships.find((rel: any) => rel.type === "cover_art");
						const fileName = coverArt?.attributes?.fileName;

						const coverImage = fileName
							? `https://uploads.mangadex.org/covers/${id}/${fileName}.256.jpg`
							: "";

						return {
							id,
							title,
							name: title,
							slug: title,
							author: attributes?.author || "Unknown",
							coverImage,
							thumb_url: coverImage,
							category: "comics",
						};
					}) || [];
					setBooks(processedBooks);
				} else {
					const response = await fetch(
						`https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(query)}&maxResults=40`
					);
					const data = await response.json();
					console.log("Books data:", data);
					const processedBooks = data?.items
						?.filter((item: any) => item.volumeInfo?.imageLinks?.thumbnail)
						.map((item: any) => ({
							id: item.id,
							title: item.volumeInfo?.title || "Untitled",
							author: item.volumeInfo?.authors?.join(", ") || "Unknown",
							coverImage: item.volumeInfo?.imageLinks?.thumbnail,
							slug: item.volumeInfo?.title || "Untitled",
							thumb_url: item.volumeInfo?.imageLinks?.thumbnail,
							name: item.volumeInfo?.title || "Untitled",
							volumeInfo: item.volumeInfo,
							category: query, // Assign the selected category
						})) || [];

					setBooks(processedBooks);
				}
			} catch (error) {
				console.error("Fetch error:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchBooks();
	}, [selectedCategory]); // Chỉ chạy khi selectedCategory thay đổi

	const handleCategorySelect = (category: string) => {
		setSelectedCategory(prev => prev === category ? null : category);
		setCurrentIndex(0); // Reset pagination khi đổi category
	};

	function shuffle(array: any[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	// Pagination controls
	const goToNext = () => {
		if (currentIndex + booksPerPage < books.length) {
			setCurrentIndex(prev => prev + booksPerPage);
		}
	};

	const goToPrevious = () => {
		if (currentIndex - booksPerPage >= 0) {
			setCurrentIndex(prev => prev - booksPerPage);
		}
	};

	const handleSearch = async () => {
		console.log(searchQuery)
		setSearchTerm(searchQuery);
		setSelectedCategory(null);
		const response = await fetch(
			`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(searchQuery)}&maxResults=40`
		);
		const data = await response.json();
		console.log(data)
		let processedBooks: Book[] = [];
		processedBooks = data?.items?.filter((item: any) => item.volumeInfo?.imageLinks?.thumbnail)
			.map((item: any) => ({
				id: item.id,
				title: item.volumeInfo?.title || "Untitled",
				author: item.volumeInfo?.authors?.join(", ") || "Unknown",
				coverImage: item.volumeInfo?.imageLinks?.thumbnail,
				slug: item.volumeInfo?.title || "Untitled",
				thumb_url: item.volumeInfo?.imageLinks?.thumbnail,
				name: item.volumeInfo?.title || "Untitled",
				volumeInfo: item.volumeInfo,
				category: selectedCategory || "Novel",
			})) || [];

		console.log(processedBooks)

		setBooks(processedBooks);
		setCurrentIndex(0);
	};


	return (
        <main className="min-h-[100dvh] bg-[#F5E9DC] text-zinc-900">
		<div className="container mx-auto px-4 py-8">
			{/* <Search /> */}
			{/* Search Box (gaze vào sẽ mở bàn phím) */}

			<GazeButton
				whileHover={{ scale: 1.2 }}
				whileTap={{ scale: 0.9 }}
				onClick={() => router.push("/")}

				className={`absolute top-5 left-10 p-8 rounded-full bg-gray-200 text-black text-5xl shadow-lg transform transition-transform duration-300 hover:scale-110 ${"hover:shadow-xl"
					} active:scale-95`}
			>
				< FaHome />
			</GazeButton>
			<div className="mb-6">

				<div className="flex gap-8 items-center w-full max-w-4xl mx-auto">
					{/* Ô nhập bằng ánh mắt */}
					<GazeButton
						onClick={() => setShowKeyboard(true)}
						className="flex items-center gap-2 flex-1 px-5 py-3 rounded-md bg-[#E64A4A] text-white text-xl shadow-inner hover:shadow-md transition"
					>
						<FiSearch className="text-white" />
						<span className={`${searchQuery ? "" : "text-white"}`}>
							{searchQuery || "Gaze here to search..."}
						</span>
					</GazeButton>

					{/* Nút Search */}
					<GazeButton
						onClick={() => {
							handleSearch();
							setShowKeyboard(false)
						}}
						className="flex items-center gap-6 px-5 py-3 rounded-md bg-[#E64A4A] hover:bg-[#B23636] text-white font-semibold text-xl shadow-md transition"
					>
						<FiSearch className="text-white text-xl" />
						Search
					</GazeButton>
				</div>
			</div>



			{showKeyboard && (
				<div className="fixed inset-0 z-50 bg-gray-200 bg-opacity-90 flex flex-col items-center justify-center space-y-4 p-4">
					<div className="absolute top-10 left-10 z-50">
						<GazeButton
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => setShowKeyboard(false)}

							className={`p-8 rounded-full bg-[#1e1f25] text-white text-3xl shadow-lg transform transition-transform duration-300 hover:scale-110 ${"hover:shadow-xl"
								} active:scale-95`}
						>
							<AiOutlineLeft />
						</GazeButton>
					</div>
					{/* Thanh hiển thị nội dung đã nhập */}
					<div className="w-full max-w-4xl bg-white text-black rounded-md  p-3 text-xl text-left shadow-md mb-16">
						{searchQuery || <span className="text-gray-400">Start typing by looking at keys...</span>}
					</div>
					<div className="grid grid-cols-9 gap-4">
						{"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => (
							<GazeButton
								key={char}
								onClick={() => setSearchQuery((prev) => prev + char)}
								className="w-24 h-24 text-white text-lg bg-[#1e1f25] rounded-md"
							>
								{char}
							</GazeButton>
						))}
					</div>

					{/* Space + Backspace */}
					<div className="flex gap-4 mt-4">
						<GazeButton
							onClick={() => setSearchQuery((prev) => prev + " ")}
							className="w-48 h-24 bg-gray-600 text-white rounded-md text-2xl"
						>
							Space
						</GazeButton>

						<GazeButton
							onClick={() =>
								setSearchQuery((prev) => prev.slice(0, prev.length - 1))
							}
							className="w-48 h-24 bg-gray-600 text-white rounded-md text-2xl"
						>
							Backspace
						</GazeButton>

						<GazeButton
							onClick={() =>
								setSearchQuery('')
							}
							className="w-48 h-24 bg-gray-600 text-white rounded-md text-2xl"
						>
							Delete All
						</GazeButton>

						<GazeButton
							onClick={() => {
								handleSearch();
								setShowKeyboard(false)
							}
							}
							className="w-48 h-24 bg-green-600 text-white rounded-md text-2xl"
						>
							Search
						</GazeButton>
					</div>
				</div>
			)}


			{/* Category Filter */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4 text-[#E64A4A]">Categories</h2>
				<div className="flex flex-wrap gap-8">
					{DEFAULT_CATEGORIES.map((category, index) => (
						<GazeButton
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => handleCategorySelect(category)}
							key={index}
							className={`p-6 rounded-full bg-[#E64A4A] text-white text-xl shadow-lg transform transition-transform duration-300 hover:scale-110 ${selectedCategory === category
								? "hover:shadow-xl bg-[#B23636]"
								: ""
								} active:scale-95`}
						>
							{category}
						</GazeButton>
					))}
				</div>
			</div>

			{/* Results Info */}
			<div className="text-[#E64A4A]">
				{isLoading ? (
					"Loading books..."
				) : (
					`Showing ${Math.min(currentIndex + booksPerPage, books.length)} of ${books.length} 
          ${selectedCategory ? `${selectedCategory} ` : ""}books`
				)}
			</div>

			{/* Books List */}
			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			) : (
				<BooksList
					books={books}
					currentIndex={currentIndex}
					goToNext={goToNext}
					goToPrevious={goToPrevious}
				/>
			)}
		</div>
        </main>
	);
}