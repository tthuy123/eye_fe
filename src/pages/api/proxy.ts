// pages/api/proxy.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { title } = req.query;

		if (!title || typeof title !== 'string') {
			return res.status(400).json({ error: 'Missing or invalid "title" parameter' });
		}

		const encodedTitle = encodeURIComponent(title);

		const response = await fetch(`https://gutendex.com/books/?search=${encodedTitle}`);

		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}

		const data = await response.json();

		res.status(200).json(data);
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'Error fetching book details' });
	}
}
