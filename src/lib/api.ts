export async function fetchBooksFromGoogleBooks(genre: string) {
	const res = await fetch(
		`https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&maxResults=10`
	);
	const data = await res.json();
	console.log(data);
	return data.items?.map((item: any) => ({
		id: item.id,
		title: item.volumeInfo.title,
		image: item.volumeInfo.imageLinks?.thumbnail,
		type: "text",
	})) ?? [];
}

export async function fetchComicsFromAnof(genre: string) {
	const res = await fetch(`https://api.anof.io/v2/comics?genres=${encodeURIComponent(genre)}&limit=10`);
	const data = await res.json();
	return data.data?.map((comic: any) => ({
		id: comic._id,
		title: comic.title,
		image: comic.thumbnail,
		type: "comic",
	})) ?? [];
}
  