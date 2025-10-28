import { NextRequest } from 'next/server';

type YtSearchItem = {
  id: { kind: string; videoId?: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails?: { medium?: { url: string } };
  };
};

type YtVideosItem = {
  id: string;
  contentDetails?: { duration?: string };
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.YT_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing YT_API_KEY' }), { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const q = (body.q as string) || '';
  const pageToken = (body.pageToken as string) || '';
  const maxResults = 12;

  const params = new URLSearchParams({
    key: apiKey,
    q,
    part: 'snippet',
    type: 'video',
    maxResults: String(maxResults),
  });
  if (pageToken) params.set('pageToken', pageToken);

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) {
    const text = await searchRes.text();
    return new Response(JSON.stringify({ error: 'YouTube search failed', details: text }), { status: 502 });
  }
  const searchJson = await searchRes.json() as { items: YtSearchItem[]; nextPageToken?: string; prevPageToken?: string };

  const videoIds = searchJson.items
    .map((i) => i.id.videoId)
    .filter((id): id is string => Boolean(id));

  let durations: Record<string, string> = {};
  if (videoIds.length) {
    const videosParams = new URLSearchParams({ key: apiKey, part: 'contentDetails', id: videoIds.join(',') });
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?${videosParams.toString()}`;
    const videosRes = await fetch(videosUrl);
    if (videosRes.ok) {
      const videosJson = await videosRes.json() as { items: YtVideosItem[] };
      for (const v of videosJson.items) {
        if (v.id && v.contentDetails?.duration) durations[v.id] = v.contentDetails.duration;
      }
    }
  }

  const items = searchJson.items
    .map((i) => {
      const videoId = i.id.videoId || '';
      return {
        id: videoId,
        title: i.snippet?.title || 'Untitled',
        channel: i.snippet?.channelTitle || 'Unknown',
        durationIso: durations[videoId] || null,
        thumb: i.snippet?.thumbnails?.medium?.url || '',
      };
    })
    .filter((x) => x.id);

  return Response.json({
    items,
    nextPageToken: (searchJson as any).nextPageToken || null,
    prevPageToken: (searchJson as any).prevPageToken || null,
  });
}


