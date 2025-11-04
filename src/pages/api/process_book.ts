import * as cheerio from 'cheerio';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

// Hàm xử lý yêu cầu API
async function handler(bookId: string): Promise<string> {
	try {
		// Thực hiện yêu cầu đến URL từ Gutenberg với bookId động
		const response = await axios.get<string>(`https://www.gutenberg.org/ebooks/${bookId}.html.images`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw new Error('Failed to fetch data');
	}
}

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
	try {
		// Lấy tham số bookId từ query string (req.query)
		const { bookId } = req.query;

		// Kiểm tra nếu không có tham số bookId
		if (!bookId || typeof bookId !== 'string') {
			return res.status(400).json({ error: 'bookId is required and must be a string' });
		}

		// Gọi hàm handler với bookId động
		const html = await handler(bookId);
		const $ = cheerio.load(html);

		const chapters: { title: string; content: string[] }[] = [];

		// Lấy thông tin các chương
		$('h2').each((i, el) => {
			const title = $(el).text().trim();
			const content: string[] = [];

			let next = $(el).next();
			while (next.length && next.prop('tagName')?.toLowerCase() !== 'h2') {
				if (next.prop('tagName')?.toLowerCase() === 'p') {
					content.push(next.text().trim());
				}
				next = next.next();
			}

			chapters.push({ title, content });
		});

		res.status(200).json({ chapters });
	} catch (error: any) {
		res.status(500).json({ error: error.message || 'Internal Server Error' });
	}
}
