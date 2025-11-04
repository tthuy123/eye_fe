import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import qs from 'qs'; // THÊM dòng này

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { mangaId } = req.query;
	const limit = 10;
	let allChapters: any[] = [];
	let offset = 0;

	if (!mangaId || typeof mangaId !== 'string') {
		return res.status(400).json({ error: 'Missing or invalid mangaId' });
	}

	try {
		while (true) {
			const query = qs.stringify({
				manga: mangaId,
				limit,
				offset,
				translatedLanguage: ['en'],
				'order[chapter]': 'asc',
			}, { arrayFormat: 'brackets' }); // QUAN TRỌNG: giúp axios encode thành translatedLanguage[]=en

			const url = `https://api.mangadex.org/chapter?${query}`;
			const response = await axios.get<{ data: any[] }>(url);

			const chapters = response.data.data;

			allChapters = [...allChapters, ...chapters];

			if (chapters.length < limit) break;

			offset += limit;
		}

		res.status(200).json(allChapters);
	} catch (error: any) {
		console.error('Error fetching chapters:', error.message);
		res.status(500).json({ error: error.message });
	}
}
