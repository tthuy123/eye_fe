"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import axios from "axios";
import { motion } from "framer-motion";
import GazeButton from "@/component/gazeButton";

interface ChapterImage {
	id: string;
	url: string;
}

interface Chapter {
	id: string;
	title: string;
}

const LazyImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
	const imgRef = useRef<HTMLImageElement>(null);
	

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && imgRef.current) {
				imgRef.current.src = src;
				observer.disconnect();
			}
		}, { rootMargin: "100px" });

		if (imgRef.current) observer.observe(imgRef.current);
		return () => observer.disconnect();
	}, [src]);

	return (
		<img
			ref={imgRef}
			alt={alt}
			className={className}
			style={{ filter: "blur(10px)", transition: "filter 0.3s ease-out" }}
			onLoad={(e) => {
				const target = e.target as HTMLImageElement;
				target.style.filter = "none";
			}}
		/>
	);
};

const ChapterDetail = () => {
	const router = useRouter();
	const params = useParams();
	const chapterId = params?.id as string;

	const [chapterImages, setChapterImages] = useState<ChapterImage[]>([]);
	const [chapterTitle, setChapterTitle] = useState<string>("");
	const [prevChapterId, setPrevChapterId] = useState<string | null>(null);
	const [nextChapterId, setNextChapterId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const pagesPerPage = 2;

	useEffect(() => {
		if (!chapterId) return;
		fetchChapter(chapterId);
	}, [chapterId]);

	const fetchChapter = async (id: string) => {
		try {
			setLoading(true);
			const res = await fetch(`https://api.mangadex.org/chapter/${id}`);
			const res_data = await res.json();
			const chapter = res_data.data;
			console.log(chapter)
			setChapterTitle(chapter.attributes?.title || `Chapter ${chapter.attributes.chapter || "?"}`);

			const hashResp = await fetch(`https://api.mangadex.org/at-home/server/${id}`);
			const hashRes = await hashResp.json();
			console.log(hashRes)
			const baseUrl = hashRes.baseUrl;
			const pages = hashRes.chapter.data;

			const images = pages.map((file: string, index: number) => ({
				id: index.toString(),
				url: `${baseUrl}/data/${hashRes.chapter.hash}/${file}`,
			}));

			console.log(images)

			setChapterImages(images);

			// Load previous & next chapter
			const mangaId = chapter.relationships.find((rel: any) => rel.type === "manga")?.id;
			if (mangaId) await fetchAdjacentChapters(mangaId, id);
		} catch (err) {
			console.error("Error loading chapter", err);
		} finally {
			setLoading(false);
		}
	};

	const fetchAdjacentChapters = async (mangaId: string, currentChapterId: string) => {
		try {
			// const { data } = await axios.get(`https://api.mangadex.org/chapter`, {
			// 	params: {
			// 		manga: mangaId,
			// 		limit: 500,
			// 		translatedLanguage: ["en"],
			// 		order: { chapter: "asc" }
			// 	}
			// });

			const response = await fetch(`/api/chapters?mangaId=${mangaId}`);
			// const data = await response.json();
			// console.log(data); // Xử lý dữ liệu nhận được từ API

			const chapters = await response.json();
			const index = chapters.findIndex((c: any) => c.id === currentChapterId);
			console.log(index)
			setPrevChapterId(index > 0 ? chapters[index - 1].id : null);
			setNextChapterId(index < chapters.length - 1 ? chapters[index + 1].id : null);
		} catch (err) {
			console.error("Error loading adjacent chapters", err);
		}
	};

	const navigateTo = (id: string | null) => {
		if (id) router.push(`/comics/chapter/${id}`);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-xl text-white">Đang tải chương...</p>
			</div>
		);
	}

	const handleNextPage = (): void => {
		if (currentPage < chapterImages.length - pagesPerPage) {
			setCurrentPage(currentPage + pagesPerPage);
			document.documentElement.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handlePreviousPage = (): void => {
		if (currentPage > 0) {
			setCurrentPage(currentPage - pagesPerPage);
			document.documentElement.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<main className="min-h-[100dvh] bg-[#F5E9DC] text-zinc-900">
		<div className="container mx-auto p-6 flex flex-col justify-center items-center">
			<motion.h1
				className="text-3xl font-bold text-center mb-6 text-[#E64A4A]"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
			>
				{chapterTitle}
			</motion.h1>
				  <motion.div
					className="flex items-center justify-center mb-16 space-x-8"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
				  >
					<GazeButton
					  whileHover={{ scale: 1.2 }}
					  whileTap={{ scale: 0.9 }}
					  onClick={handlePreviousPage}
					  disabled={currentPage === 0}
					  className={`p-10 rounded-full bg-[#E64A4A] text-white text-5xl shadow-lg transform transition-transform duration-300 hover:scale-110 ${
						currentPage === 0
						  ? "opacity-50 cursor-not-allowed"
						  : "hover:shadow-xl"
					  } active:scale-95`}
					>
					  <AiOutlineLeft />
					</GazeButton>
			
					<motion.div
					  className="grid gap-4 md:gap-8 sm:grid-cols-2 md:grid-cols-2"
					  initial={{ opacity: 0 }}
					  animate={{ opacity: 1 }}
					  transition={{ duration: 0.25 }}
					>
					  {chapterImages
						.slice(currentPage, currentPage + pagesPerPage)
						.map((img) => (
						  <motion.div
							key={img.id}
							className="relative"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.25 }}
						  >
							<LazyImage
							  src={img.url}
							  alt={`Page ${img.id}`}
							  className="max-h-[63vh] max-w-[27vw] shadow-lg rounded-lg object-contain"
							/>
						  </motion.div>
						))}
					</motion.div>
			
					<GazeButton
					  whileHover={{ scale: 1.2 }}
					  whileTap={{ scale: 0.9 }}
					  onClick={handleNextPage}
					  disabled={currentPage >= chapterImages.length - pagesPerPage}
					  className={`p-10 rounded-full bg-[#E64A4A] text-white text-5xl shadow-lg transform transition-transform duration-300 hover:scale-110 ${
						currentPage >= chapterImages.length - pagesPerPage
						  ? "opacity-50 cursor-not-allowed"
						  : "hover:shadow-xl"
					  } active:scale-95`}
					>
					  <AiOutlineRight />
					</GazeButton>
			</motion.div>
			
			<GazeButton
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => router.back()}
					className="bg-[#E64A4A] text-[#293041] px-6 py-2 rounded-lg hover:bg-[#3f4759] hover:text-[#dbe2f9] shadow-lg"
					style={{ width: "200px", height: "100px" }}
				  >
					Back
				  </GazeButton>
		</div>
		</main>
	);
};

export default ChapterDetail;
