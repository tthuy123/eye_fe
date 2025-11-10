// "use client";
// import { useRouter } from "next/navigation";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
// import { motion } from "framer-motion";
// import GazeButton from "@/component/gazeButton";
// // import MainLayout from "@/components/mainLayout";

// // Kiểu dữ liệu
// type Chapter = {
//   chapter_name: string;
//   chapter_api_data: string;
// };

// type Book = {
//   name: string;
//   content: string;
//   thumb_url: string;
//   chapters: {
// 	server_data: Chapter[];
//   }[];
// };

// type BookResponse = {
//   data: {
// 	item: Book;
//   };
// };

// // export const metadata = {
// //   title: "Book | Reading | Eyetertainment",
// // };

// export default function BookDetail() {
// 	const router = useRouter();
// 	const params = useParams();
//   const slug = params?.slug as string;
//   const [book, setBook] = useState<Book | null>(null);
//   const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
//   const chaptersPerPage = 4;

// //   useEffect(() => {
// //     document.title = metadata.title;
// //   }, []);

//   useEffect(() => {
// 	  if (slug && typeof slug === "string") {
// 	  fetchBookDetail(slug);
// 	}
//   }, [slug]);

//   const fetchBookDetail = async (bookSlug: string) => {
// 	try {
// 	  const response = await axios.get<BookResponse>(
// 	    `https://otruyenapi.com/v1/api/truyen-tranh/${bookSlug}`,
// 	    {
// 	      headers: { Accept: "application/json" },
// 	    }
// 		);
// 		 console.log("Book detail response:", response.data);
// 	  const bookData = response.data?.data?.item || null;
// 		  setBook(bookData);
// 		// const response = await fetch(
// 		// 	`https://www.googleapis.com/books/v1/volumes/${bookSlug}`
// 		//   );
// 		// const data = await response.json();
// 		// const bookData = data?.item || null;
// 		// console.log(bookData)
// 		//   setBook(bookData);
// 	} catch (error: any) {
// 	  console.error("Error fetching book detail:", error.message);
// 	}
//   };

//   const cleanContent = (rawContent: string | undefined) => {
// 	if (!rawContent) return "";
// 	let cleanedContent = rawContent.replace(/<\/?p>/g, "");
// 	cleanedContent = cleanedContent.replace(/^19\s*/, "");
// 	return cleanedContent.length > 500
// 	  ? cleanedContent.slice(0, 500) + "..."
// 	  : cleanedContent.trim();
//   };

//   const handleNext = () => {
// 	if (
// 	  book &&
// 	  currentChapterIndex + chaptersPerPage <
// 		book.chapters[0].server_data.length
// 	) {
// 	  setCurrentChapterIndex(currentChapterIndex + chaptersPerPage);
// 	}
//   };

//   const handlePrevious = () => {
// 	if (currentChapterIndex > 0) {
// 	  setCurrentChapterIndex(currentChapterIndex - chaptersPerPage);
// 	}
//   };

//   if (!book) {
// 	return (
// 	  <div className="flex justify-center items-center h-screen bg-gray-100">
// 		<motion.div
// 		  initial={{ scale: 0 }}
// 		  animate={{ scale: 1 }}
// 		  transition={{
// 			duration: 0.5,
// 			repeat: Infinity,
// 			repeatType: "reverse",
// 		  }}
// 		  className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
// 		></motion.div>
// 	  </div>
// 	);
//   }

//   const chapters = book?.chapters?.[0]?.server_data || [];
//   const totalPages = Math.ceil(chapters.length / chaptersPerPage);
//   const currentPage = Math.floor(currentChapterIndex / chaptersPerPage) + 1;

//   return (
// 	// <MainLayout>
// 	  <div className="container mx-auto p-6 flex flex-col items-center justify-center h-screen mt-10">
// 		<div className="flex items-start space-x-8 mb-16">
// 		  <img
// 			src={`https://otruyenapi.com/uploads/comics/${book.thumb_url}`}
// 			alt={book.name}
// 			className="w-1/4 h-auto object-cover rounded-lg shadow-lg"
// 			style={{ maxWidth: "300px" }}
// 		  />

// 		  <div className="flex-1 max-w-2xl">
// 			<h1 className="text-3xl font-bold mb-4 text-black text-left">
// 			  {book.name}
// 			</h1>
// 			<p className="text-lg text-black mb-6 text-left">
// 			  {cleanContent(book.content) || "Không có mô tả."}
// 			</p>
// 		  </div>
// 		</div>

// 		<div className="flex items-center justify-center mb-16 space-x-8">
// 		  {/* Nút Previous */}
// 		  <GazeButton
// 			whileHover={{ scale: 1.2 }}
// 			whileTap={{ scale: 0.9 }}
// 			onClick={handlePrevious}
// 			disabled={currentChapterIndex === 0}
// 			className={`p-10 rounded-full bg-[#1e1f25] text-white text-5xl shadow-lg transform transition-transform duration-300 hover:scale-110 ${
// 			  currentChapterIndex === 0
// 				? "opacity-50 cursor-not-allowed"
// 				: "hover:shadow-xl"
// 			}active:scale-95`}
// 		  >
// 			<AiOutlineLeft />
// 		  </GazeButton>

// 		  {/* Lưới chương */}
// 		  <motion.div
// 			className="grid gap-4 md:gap-8 sm:grid-cols-2 md:grid-cols-4"
// 			initial={{ opacity: 0, y: 20 }}
// 			animate={{ opacity: 1, y: 0 }}
// 			transition={{ duration: 0.5 }}
// 			style={{
// 			  gridTemplateColumns: `repeat(${chaptersPerPage}, 1fr)`,
// 			}}
// 		  >
// 			{chapters
// 			  .slice(currentChapterIndex, currentChapterIndex + chaptersPerPage)
// 			  .map((chapter, index) => (
// 				<GazeButton
// 				  key={index}
// 				  whileHover={{ scale: 1.05 }}
// 				  whileTap={{ scale: 0.95 }}
// 				  className="bg-[#bfc6dc] text-[#293041] rounded-lg hover:bg-[#3f4759] hover:text-[#dbe2f9] text-2xl flex items-center justify-center shadow-lg"
// 				  style={{
// 					width: "200px",
// 					height: "100px",
// 				  }}
// 				  onClick={() => {
// 					const chapterId = chapter.chapter_api_data.split("/").pop();
// 					router.push(`/book/chapter/${chapterId}`);
// 				  }}
// 				>
// 				  Chap {chapter.chapter_name}
// 				</GazeButton>
// 			  ))}
// 		  </motion.div>

// 		  {/* Nút Next */}
// 		  <GazeButton
// 			whileHover={{ scale: 1.2 }}
// 			whileTap={{ scale: 0.9 }}
// 			onClick={handleNext}
// 			disabled={
// 			  currentChapterIndex + chaptersPerPage >= chapters.length
// 			}
// 			className={`p-10 rounded-full bg-[#1e1f25] text-white text-5xl shadow-lg transform transition-transform duration-300 hover:scale-110 ${
// 			  currentChapterIndex + chaptersPerPage >= chapters.length
// 				? "opacity-50 cursor-not-allowed"
// 				: "hover:shadow-xl"
// 			}active:scale-95`}
// 		  >
// 			<AiOutlineRight />
// 		  </GazeButton>
// 		</div>

// 		{/* Nút quay lại */}
// 		<div className="flex mt-8">
// 		  <GazeButton
// 			whileHover={{ scale: 1.1 }}
// 			whileTap={{ scale: 0.95 }}
// 			onClick={() => router.back()}
// 			className="bg-[#bfc6dc] text-2xl text-[#293041] px-6 py-2 rounded-lg hover:bg-[#3f4759] hover:text-[#dbe2f9] shadow-lg"
// 			style={{ width: "200px", height: "100px" }}
// 		  >
// 			Back
// 		  </GazeButton>
// 		</div>
// 	  </div>
// 	// </MainLayout>
//   );
// }



"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { motion } from "framer-motion";
import GazeButton from "@/component/gazeButton";

type Manga = {
	id: string;
	title: string;
	description: string;
	thumb_url: string;
};

type Chapter = {
	id: string;
	chapter: string;
	title?: string;
	pages?: number;
};

export default function BookDetail() {
	const router = useRouter();
	const params = useParams();
	const mangaId = params?.slug as string; // MangaDex sử dụng id chứ không phải slug
	const [book, setBook] = useState<Manga | null>(null);
	const [chapters, setChapters] = useState<Chapter[]>([]);
	const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
	const chaptersPerPage = 4;

	useEffect(() => {
		if (mangaId) {
			fetchMangaInfo(mangaId);
			fetchChapters(mangaId);
		}
	}, [mangaId]);

	const fetchMangaInfo = async (id: string) => {
		try {
			const res = await fetch(
				`https://api.mangadex.org/manga/${id}?includes[]=cover_art`
			);
			const data = await res.json();
			const manga = data.data;
			console.log(manga)
			const attributes = manga.attributes;

			// Lấy title từ altTitles.en nếu không có title.en
			let title = attributes.title.en;
			if (!title) {
				const altEn = attributes.altTitles.find((alt: any) => alt.en);
				title = altEn?.en || "Untitled";
			}

			const description = attributes.description?.en || "No description.";
			const coverArt = manga.relationships.find(
				(rel: any) => rel.type === "cover_art"
			);
			const coverFilename = coverArt?.attributes?.fileName;
			const thumb_url = `https://uploads.mangadex.org/covers/${id}/${coverFilename}.256.jpg`;

			setBook({ id, title, description, thumb_url });
		} catch (err) {
			console.error("Failed to fetch manga info", err);
		}
	};

	// const fetchChapters = async (id: string) => {
	// 	try {
	// 		const res = await fetch(
	// 			`https://api.mangadex.org/chapter?manga=${id}&translatedLanguage[]=en&order[chapter]=asc&limit=100`
	// 		);
	// 		const data = await res.json();
	// 		console.log(data)
	// 		const chapterList: Chapter[] = data.data.map((c: any) => ({
	// 			id: c.id,
	// 			chapter: c.attributes.chapter || "??",
	// 			title: c.attributes.title,
	// 		}));
	// 		setChapters(chapterList);
	// 	} catch (err) {
	// 		console.error("Failed to fetch chapters", err);
	// 	}
	// };

	const fetchChapters = async (id: string) => {
		try {
			// Thử lấy chapters tiếng Anh trước
			let res = await fetch(
				`https://api.mangadex.org/chapter?manga=${id}&translatedLanguage[]=en&order[chapter]=asc&limit=100`
			);
			let data = await res.json();
			let rawChapters: any[] = data.data;

			console.log("English chapters count:", rawChapters.length);
			console.log("Raw chapters data:", rawChapters);

			// Nếu không có chapters tiếng Anh, thử lấy tất cả ngôn ngữ
			if (rawChapters.length === 0) {
				console.log("No English chapters, trying all languages...");
				res = await fetch(
					`https://api.mangadex.org/chapter?manga=${id}&order[chapter]=asc&limit=100`
				);
				data = await res.json();
				rawChapters = data.data;
				console.log("All language chapters count:", rawChapters.length);
			}

			// Lọc và map chapters - không filter gì cả, lấy hết
			const chapterList: Chapter[] = [];
			
			for (let i = 0; i < rawChapters.length; i++) {
				const c = rawChapters[i];
				const chNum = c.attributes.chapter || `oneshot-${i}`;
				
				chapterList.push({
					id: c.id,
					chapter: chNum,
					title: c.attributes.title || "Untitled",
					pages: c.attributes.pages || 0,
				});
			}

			console.log("Total chapters added:", chapterList.length);
			console.log("First few chapters:", chapterList.slice(0, 5));

			setChapters(chapterList);
		} catch (err) {
			console.error("Failed to fetch chapters", err);
		}
	};
	  

	const handleNext = () => {
		if (currentChapterIndex + chaptersPerPage < chapters.length) {
			setCurrentChapterIndex(currentChapterIndex + chaptersPerPage);
		}
	};

	const handlePrevious = () => {
		if (currentChapterIndex > 0) {
			setCurrentChapterIndex(currentChapterIndex - chaptersPerPage);
		}
	};

	if (!book) {
		return (
			<div className="flex justify-center items-center h-screen bg-gray-100">
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{
						duration: 0.5,
						repeat: Infinity,
						repeatType: "reverse",
					}}
					className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
				></motion.div>
			</div>
		);
	}

	const currentPageChapters = chapters.slice(
		currentChapterIndex,
		currentChapterIndex + chaptersPerPage
	);

	return (
		<main className="min-h-screen bg-[#F5E9DC] text-zinc-900 overflow-hidden">
        <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen">
			<div className="flex items-start space-x-8 mb-16">
				<img
					src={book.thumb_url}
					alt={book.title}
					className="w-1/4 h-auto object-cover rounded-lg shadow-lg"
					style={{ maxWidth: "300px" }}
				/>

				<div className="flex-1 max-w-2xl">
					<h1 className="text-3xl font-bold mb-4 text-black text-left">{book.title}</h1>
					<p className="text-lg text-black mb-6 text-left">
						{book.description.length > 500
							? book.description.slice(0, 500) + "..."
							: book.description}
					</p>
				</div>
			</div>

			<div className="flex items-center justify-center mb-16 space-x-8">
				{/* Nút Previous */}
				<GazeButton
					whileHover={{ scale: 1.2 }}
					whileTap={{ scale: 0.9 }}
					onClick={handlePrevious}
					disabled={currentChapterIndex === 0 || chapters.length === 0}
					className="p-10 rounded-full bg-[#E64A4A] text-white text-5xl"
				>
					<AiOutlineLeft />
				</GazeButton>

				{/* Lưới chương hoặc thông báo không có chapters */}
				{chapters.length > 0 ? (
					<motion.div
						className="grid gap-4 md:gap-8 sm:grid-cols-2 md:grid-cols-4"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						{currentPageChapters.map((chapter, index) => (
							<GazeButton
								key={index}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-[#E64A4A] text-white rounded-lg hover:bg-[#d43d3d] text-2xl flex items-center justify-center shadow-lg"
								style={{
									width: "200px",
									height: "100px",
								}}
								onClick={() => {
									router.push(`/comics/chapter/${chapter.id}`);
								}}
							>
								{chapter.chapter.startsWith('oneshot') ? chapter.title : `Chap ${chapter.chapter}`}
							</GazeButton>
						))}
					</motion.div>
				) : (
					<div className="bg-yellow-100 border border-yellow-400 rounded-lg p-8 text-center" style={{ width: "600px" }}>
						<p className="text-2xl text-yellow-800 font-semibold mb-2">
							⚠️ No chapters available
						</p>
						<p className="text-lg text-yellow-700">
							This manga may not have readable chapters yet.
						</p>
					</div>
				)}

				{/* Nút Next */}
				<GazeButton
					whileHover={{ scale: 1.2 }}
					whileTap={{ scale: 0.9 }}
					onClick={handleNext}
					disabled={currentChapterIndex + chaptersPerPage >= chapters.length || chapters.length === 0}
					className="p-10 rounded-full bg-[#E64A4A] text-white text-5xl"
				>
					<AiOutlineRight />
				</GazeButton>
			</div>

			{/* Nút Back */}
			<div className="flex mt-8">
				<GazeButton
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => router.back()}
					className="bg-[#E64A4A] text-2xl text-[#293041] px-6 py-2 rounded-lg hover:bg-[#3f4759] hover:text-[#dbe2f9] shadow-lg"
					style={{ width: "200px", height: "100px" }}
				>
					Back
				</GazeButton>
			</div>
		</div>
		</main>
	);
}
