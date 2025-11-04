
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GazeButton from "@/component/gazeButton";
import { AiOutlineLeft } from "react-icons/ai";
import { GazeScrollButton } from "@/component/button/gazeScrollButton";
import AutoScrollToggle from "@/component/button/autoScrollButton";
import SpeakButton from "@/component/button/speakButton";

type Chapter = {
	id: string;
	title: string;
	content: string[];
};

type Novel = {
	id: string;
	title: string;
	author: string;
	description: string;
	thumbnail: string;
	chapters: Chapter[];
	metadata: {
		publisher?: string;
		language?: string;
		releaseDate?: string;
	};
};

export default function NovelReaderPage() {
	const params = useParams();
	const router = useRouter();
	const [novel, setNovel] = useState<Novel | null>(null);
	const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [isReading, setIsReading] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const paragraphsPerPage = 8;

	// Fetch novel data
	useEffect(() => {
		const fetchNovel = async () => {
			try {
				const response = await fetch(`/api/proxy?title=${params?.slug}`);
				const data = await response.json();
				console.log("Book detail response:", data);
				const bookData = (data as { results: any[] })?.results?.[0] || null;
				if (bookData) {
					// Lấy nội dung sách từ link HTML
					const htmlUrl = bookData.formats["text/html"];
					console.log(htmlUrl)
					const thumbnailUrl = bookData.formats["image/jpeg"];
					const htmlResponse = await fetch(`/api/process_book?bookId=${bookData.id}`);
					const htmlContent = await htmlResponse.json();
					console.log(htmlContent)

					const parsedChapters: Chapter[] = htmlContent.chapters
						.filter((ch: any) =>
							typeof ch.title === "string" &&
							ch.title.toLowerCase().includes("chapter") &&
							Array.isArray(ch.content) && ch.content.length > 0
						)
						.map((ch: any, idx: number) => ({
							id: `chapter-${idx + 1}`,
							title: ch.title.replace(/\n/g, ' ').trim(),
							content: ch.content
						}));

					// Tạo đối tượng novel từ dữ liệu
					const novelData: Novel = {
						id: params?.slug as string,
						title: bookData.title,
						author: bookData.authors?.[0]?.name || "",
						description: bookData.summaries[0] || "",
						thumbnail: thumbnailUrl || "/default-cover.jpg",
						chapters: parsedChapters,
						metadata: {
							publisher: "Project Gutenberg",
							language: bookData.languages?.[0] || "English",
							releaseDate: bookData.release_date || "Unknown"
						}
					};

					setNovel(novelData);
				}
				// setNovel(bookData);
			} catch (error) {
				console.error("Failed to fetch novel:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchNovel();
	}, [params?.slug]);

	// Reset page when chapter changes
	useEffect(() => {
		setCurrentPage(1);
	}, [currentChapterIndex]);

	const renderGutenbergHeader = () => (
		<div id="pg-header" className="mb-4 text-center">
			<h1 id="pg-header-heading" className="text-3xl font-bold mb-4">
				{novel?.title}
			</h1>
			<div className="text-xl mb-6">by {novel?.author}</div>

			<div id="pg-start-separator" className="my-10 border-t border-gray-300 w-1/2 mx-auto"></div>

		</div>
	);


	const renderReadingContent = () => {
		if (!novel) return null;

		const chapter = novel.chapters[currentChapterIndex];
		const startIdx = (currentPage - 1) * paragraphsPerPage;
		const endIdx = startIdx + paragraphsPerPage;
		const visibleParagraphs = chapter.content.slice(startIdx, endIdx);
		const totalPages = Math.ceil(chapter.content.length / paragraphsPerPage);

		return (
			<div>
				<div className="fixed right-16 top-1/2 transform -translate-y-1/2 flex flex-col gap-6 z-50">
					<GazeScrollButton direction="up" />
					<AutoScrollToggle />
					<GazeScrollButton direction="down" />
					<SpeakButton text={visibleParagraphs.join(" ")} />
				</div>

				<div className="max-w-3xl mx-auto">
					{/* Chapter Navigation */}
					<div className="flex justify-between items-center mb-8 bg-[#F5E9DC] p-4 rounded-lg">
						<GazeButton
							onClick={() => setCurrentChapterIndex(i => Math.max(0, i - 1))}
							disabled={currentChapterIndex === 0}
							className="px-5 py-6 bg-[#E64A4A] rounded-lg hover:bg-[#F5E9DC] disabled:opacity-50"
							whileHover={{ scale: 1.05 }}
						>
							← Previous Chapter
						</GazeButton>

						<span className="font-medium text-lg">
							{chapter.title}
						</span>

						<GazeButton
							onClick={() => setCurrentChapterIndex(i => Math.min(novel.chapters.length - 1, i + 1))}
							disabled={currentChapterIndex === novel.chapters.length - 1}
							className="px-5 py-6 bg-[#E64A4A] rounded-lg hover:bg-[#F5E9DC] disabled:opacity-50"
							whileHover={{ scale: 1.05 }}
						>
							Next Chapter →
						</GazeButton>
					</div>

					{/* Chapter Content */}
					<div className="prose lg:prose-xl mx-auto">
						{visibleParagraphs.map((para, idx) => (
							<motion.p
								key={idx}
								className="text-justify indent-8 my-4 leading-relaxed"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: idx * 0.05 }}
							>
								{para}
							</motion.p>
						))}
					</div>

					{/* Page Navigation */}
					<div className="flex justify-between items-center mt-10 mb-16">
						<GazeButton
							onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							className="px-5 py-6 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
							whileHover={{ scale: 1.05 }}
						>
							← Previous Page
						</GazeButton>

						<span className="text-gray-600">
							Page {currentPage} of {totalPages}
						</span>

						<GazeButton
							onClick={() => setCurrentPage(p => p + 1)}
							disabled={currentPage >= totalPages}
							className="px-5 py-6 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
							whileHover={{ scale: 1.05 }}
						>
							Next Page →
						</GazeButton>
					</div>
				</div>
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ repeat: Infinity, duration: 1 }}
					className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
				/>
			</div>
		);
	}

	if (!novel) {
		return (
			<div className="text-center py-20">
				<h1 className="text-2xl font-bold mb-4">Novel Not Found</h1>
				<GazeButton
					onClick={() => router.back()}
					className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					Go Back
				</GazeButton>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F5E9DC] text-zinc-900 overflow-hidden">
			{!isReading ? (
				<div>
					<div className="absolute top-10 left-10 z-50">
						<GazeButton
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => router.push("/books")}

							className={`p-8 rounded-full bg-[#E64A4A] text-white text-3xl shadow-lg transform transition-transform duration-300 hover:scale-110 ${"hover:shadow-xl"
								} active:scale-95`}
						>
							<AiOutlineLeft />
						</GazeButton>
					</div>
					
					<div className="p-6 flex flex-col items-center justify-center">
						<div className="flex items-start gap-10 mb-8 w-full max-w-5xl">
							{/* Ảnh bên trái */}
							<img
								src={novel.thumbnail}
								alt={novel.title}
								className="w-96 h-auto object-cover rounded-lg shadow-lg"
							/>

							{/* Nội dung bên phải */}
							<div className="flex-1 flex flex-col">
								<h1 className="text-4xl font-bold mb-4 text-black text-left">
									{novel.title}
								</h1>
								<p className="text-lg text-black mb-6 mt-6 text-left">
									{novel.description.length > 500
										? novel.description.slice(0, 500) + "..."
										: novel.description}
								</p>
								
							</div>
						</div>
						<GazeButton
							onClick={() => setIsReading(true)}
							className="px-10 py-6 bg-[#E64A4A] rounded-lg hover:bg-gray-300 text-black text-xl w-fit"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Start Reading
						</GazeButton>
					</div>



					{/* <motion.div
						initial={false}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="max-w-4xl mx-auto"
					>
						{/* {renderGutenbergHeader()} */}

					{/* <div className="flex flex-col items-center my-16 gap-6 mb-8">
							<motion.img
								src={novel.thumbnail}
								alt={novel.title}
								className="w-64 h-96 object-cover rounded-lg shadow-xl"
								whileHover={{ scale: 1.03 }}
							/>
							<GazeButton
								onClick={() => setIsReading(true)}
								className="px-8 py-6 bg-gray-200 rounded-lg hover:bg-gray-300 text-black text-xl rounded-lg hover:bg-gray-300"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Start Reading
							</GazeButton>
						</div> */}

					{/* {renderGutenbergFooter()} */}
					{/* </motion.div> */}
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					{/* Back Button */}
					<div className="max-w-4xl ml-8 mb-6 fixed justify-start">
						<GazeButton
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => setIsReading(false)}

							className={`p-8 rounded-full bg-[#E64A4A] text-white text-3xl shadow-lg transform transition-transform duration-300 hover:scale-110 ${"hover:shadow-xl"
								} active:scale-95`}
						>
							<AiOutlineLeft />
						</GazeButton>
					</div>

					{renderReadingContent()}
				</motion.div>
			)}
		</div>
	);
}