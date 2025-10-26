// ...existing code...
"use client";
import { useEffect, useState, ButtonHTMLAttributes, ReactNode } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";

/**
 * Temporary placeholders for missing imports (BooksList, GazeButton).
 * Replace these with your real components when available.
 */

type Book = {
    id: string;
    title: string;
    author?: string;
    coverImage?: string;
    slug: string;
    thumb_url: string;
    name: string;
    chaptersLatest?: any;
    category?: string;
    volumeInfo?: { [k: string]: any; categories?: string[] };
};

function GazeButton(props: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) {
    const { children, className = "", ...rest } = props;
    return (
        <button
            {...rest}
            className={`inline-flex items-center justify-center ${className}`}
        >
            {children}
        </button>
    );
}

function BooksList({
    books,
    currentIndex,
    goToNext,
    goToPrevious,
    booksPerPage = 4,
}: {
    books: Book[];
    currentIndex: number;
    goToNext: () => void;
    goToPrevious: () => void;
    booksPerPage?: number;
}) {
    const visible = books.slice(currentIndex, currentIndex + booksPerPage);
    return (
        <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {visible.map((b) => (
                    <div key={b.id} className="bg-white/5 p-4 rounded">
                        {b.thumb_url ? (
                            <img src={b.thumb_url} alt={b.title} className="w-full h-40 object-cover rounded mb-2" />
                        ) : (
                            <div className="w-full h-40 bg-gray-700 rounded mb-2 flex items-center justify-center text-gray-300">
                                No image
                            </div>
                        )}
                        <div className="text-white font-semibold">{b.title}</div>
                        <div className="text-gray-400 text-sm">{b.author}</div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4">
                <button onClick={goToPrevious} className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50" disabled={currentIndex === 0}>
                    Previous
                </button>
                <button onClick={goToNext} className="px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-50" disabled={currentIndex + booksPerPage >= books.length}>
                    Next
                </button>
            </div>
        </div>
    );
}

/* ...existing code... */
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
                    const doraemonRes = await fetch(
                        `https://api.mangadex.org/manga?limit=10&title=doraemon&includes[]=cover_art`
                    );
                    const doraemonData = await doraemonRes.json();

                    const popularRes = await fetch(
                        `https://api.mangadex.org/manga?limit=30&order[followedCount]=desc&includes[]=cover_art`
                    );
                    const popularData = await popularRes.json();

                    const combined = [...(doraemonData.data || []), ...(popularData.data || [])];
                    shuffle(combined);

                    const MAX_WORD_COUNT = 8;

                    const data = combined.filter((manga: any) => {
                        const titleObj = manga.attributes?.title;
                        let title = titleObj?.en;
                        if (!title) {
                            title = manga.attributes?.altTitles?.find((alt: any) => alt?.en)?.en;
                        }
                        if (!title) {
                            title = titleObj?.ja || Object.values(titleObj || {})[0] || 'No title available';
                        }
                        const wordCount = title.trim().split(/\s+/).length;
                        return wordCount <= MAX_WORD_COUNT;
                    });

                    const processedBooks = (data || []).map((manga: any) => {
                        const id = manga.id;
                        const attributes = manga.attributes;
                        let title = attributes?.title?.en;
                        if (!title) {
                            const altEn = attributes?.altTitles?.find((alt: any) => alt?.en);
                            title = altEn?.en || "Untitled";
                        }
                        const coverArt = manga.relationships?.find((rel: any) => rel.type === "cover_art");
                        const fileName = coverArt?.attributes?.fileName;
                        const coverImage = fileName ? `https://uploads.mangadex.org/covers/${id}/${fileName}.256.jpg` : "";
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
                            category: query,
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
    }, [selectedCategory]);

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(prev => prev === category ? null : category);
        setCurrentIndex(0);
    };

    function shuffle(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

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
        setSearchTerm(searchQuery);
        setSelectedCategory(null);
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(searchQuery)}&maxResults=40`
        );
        const data = await response.json();
        const processedBooks: Book[] = data?.items?.filter((item: any) => item.volumeInfo?.imageLinks?.thumbnail)
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
        setBooks(processedBooks);
        setCurrentIndex(0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <GazeButton
                onClick={() => router.push("/")}
                className={`absolute top-5 left-10 p-8 rounded-full bg-gray-200 text-black text-5xl shadow-lg`}
            >
                <FaHome />
            </GazeButton>

            <div className="mb-6">
                <div className="flex gap-8 items-center w-full max-w-4xl mx-auto">
                    <GazeButton
                        onClick={() => setShowKeyboard(true)}
                        className="flex items-center gap-2 flex-1 px-5 py-3 rounded-md bg-[#2c2d34] text-white text-xl shadow-inner"
                    >
                        <FiSearch className="text-gray-400 text-2xl" />
                        <span className={`${searchQuery ? "" : "text-gray-400"}`}>
                            {searchQuery || "Gaze here to search..."}
                        </span>
                    </GazeButton>

                    <GazeButton
                        onClick={() => {
                            handleSearch();
                            setShowKeyboard(false);
                        }}
                        className="flex items-center gap-6 px-5 py-3 rounded-md bg-sky-600 text-white font-semibold text-xl shadow-md"
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
                            onClick={() => setShowKeyboard(false)}
                            className={`p-8 rounded-full bg-[#1e1f25] text-white text-3xl shadow-lg`}
                        >
                            <AiOutlineLeft />
                        </GazeButton>
                    </div>

                    <div className="w-full max-w-4xl bg-white text-black rounded-md p-3 text-xl text-left shadow-md mb-16">
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
                                setShowKeyboard(false);
                            }}
                            className="w-48 h-24 bg-green-600 text-white rounded-md text-2xl"
                        >
                            Search
                        </GazeButton>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Categories</h2>
                <div className="flex flex-wrap gap-8">
                    {DEFAULT_CATEGORIES.map((category, index) => (
                        <GazeButton
                            onClick={() => handleCategorySelect(category)}
                            key={index}
                            className={`p-6 rounded-full bg-[#1e1f25] text-white text-xl shadow-lg ${selectedCategory === category ? "hover:shadow-xl" : "opacity-70"}`}
                        >
                            {category}
                        </GazeButton>
                    ))}
                </div>
            </div>

            <div className="text-gray-300">
                {isLoading ? (
                    "Loading books..."
                ) : (
                    `Showing ${Math.min(currentIndex + booksPerPage, books.length)} of ${books.length} ${selectedCategory ? `${selectedCategory} ` : ""}books`
                )}
            </div>

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
                    booksPerPage={booksPerPage}
                />
            )}
        </div>
    );
}
/* ...existing code... */