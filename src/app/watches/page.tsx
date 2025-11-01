// src/app/watches/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './watches.module.css';

type VideoItem = {
  id: string;
  title: string;
  channel: string;
  durationIso?: string | null;
  thumb: string;
};
type SearchResponse = {
  items: VideoItem[];
  nextPageToken: string | null;
  prevPageToken: string | null;
};

const suggestionChips = ['Thư giãn', 'Bài tập mắt', 'Tập trung', 'Âm thanh', 'Thiền', 'Hướng dẫn'];

export default function WatchesPage() {
  const [query, setQuery] = useState('');
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<VideoItem[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevToken, setPrevToken] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeChip) setQuery(activeChip);
  }, [activeChip]);

  useEffect(() => {
    // initial load with a helpful default
    if (results.length === 0 && !loading) {
      void runSearch('Bài tập mắt');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSearch = async (q: string, pageToken?: string) => {
    setLoading(true);
    setError(null);
    setPlayerLoading(true);
    try {
      const res = await fetch('/api/youtube/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q, pageToken }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Search failed');
      }
      const data = (await res.json()) as SearchResponse;
      setResults(data.items);
      setNextToken(data.nextPageToken);
      setPrevToken(data.prevPageToken);
      setSelectedVideo(data.items[0] || null);
    } catch (e: any) {
      setError(e?.message || 'Lỗi tìm kiếm');
    } finally {
      setLoading(false);
      setPlayerLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Escape') {
      setFocusedIndex(-1);
      inputRef.current?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const q = (query || activeChip || 'Bài tập mắt').trim();
      if (q) {
        void runSearch(q);
      }
    }
  };

  const formatIsoDuration = (iso?: string | null) => {
    if (!iso) return '';
    // Minimal ISO8601 PT#H#M#S parser
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return '';
    const h = parseInt(m[1] || '0', 10);
    const mm = parseInt(m[2] || '0', 10);
    const ss = parseInt(m[3] || '0', 10);
    const pad = (n: number) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${pad(mm)}:${pad(ss)}` : `${mm}:${pad(ss)}`;
  };

  const handleVideoSelect = (video: VideoItem) => {
    setSelectedVideo(video);
    setPlayerLoading(true);
  };

  const handlePlayerLoad = () => {
    setPlayerLoading(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.brandMini} aria-label="EYE WEB" />
          <h1 className={styles.pageTitle}>Xem YouTube</h1>
        </div>
        <Link href="/" className={styles.headerLink}>Trang chủ</Link>
      </header>

      <section className={styles.searchSection}>
        <div className={styles.searchBarWrap}>
          <div className={styles.searchIcon} aria-hidden>🔎</div>
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="Tìm video (nói hoặc nhập)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Ô tìm kiếm video"
            disabled={loading}
          />
          <button 
            className={`${styles.voiceBtn} ${loading ? styles.voiceBtnLoading : ''}`} 
            aria-label="Tìm kiếm bằng giọng nói" 
            onClick={() => runSearch(query || 'Bài tập mắt')}
            disabled={loading}
          >
            {loading ? '⏳' : '🎙️'}
          </button>
        </div>
        <div className={styles.chips}>
          {suggestionChips.map((c) => (
            <button
              key={c}
              className={`${styles.chip} ${activeChip === c ? styles.chipActive : ''} ${loading ? styles.chipDisabled : ''}`}
              onClick={() => {
                if (loading) return;
                const next = activeChip === c ? null : c;
                setActiveChip(next);
                void runSearch(next || '');
              }}
              disabled={loading}
            >
              {c}
            </button>
          ))}
        </div>
        <div>
          {error ? <div style={{ color: 'salmon', marginTop: '0.5rem' }}>{error}</div> : null}
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.playerPanel}>
          <div className={styles.playerMock}>
            {playerLoading && (
              <div className={styles.playerLoadingOverlay}>
                <div className={styles.loadingSpinner}></div>
                <span>Đang tải video...</span>
              </div>
            )}
            {selectedVideo ? (
              <iframe
                title={selectedVideo.title}
                className={styles.playerIframe as any}
                src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={handlePlayerLoad}
              />
            ) : (
              <div className={styles.playerPlaceholder}>
                <button className={styles.playerPlay} aria-label="Phát video">▶</button>
                <p>Chọn video để xem</p>
              </div>
            )}
          </div>
          <div className={styles.playerMeta}>
            <h2 className={styles.videoTitle}>{selectedVideo?.title || 'Chọn video để xem'}</h2>
            <div className={styles.videoChannel}>
              {selectedVideo ? `Kênh: ${selectedVideo.channel}` : 'Chưa có video được chọn'}
            </div>
          </div>
        </div>

        <div className={styles.resultsPanel}>
          {loading ? (
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonThumb}></div>
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonChannel}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.resultsGrid}>
              {results.map((v, i) => (
                <button
                  key={v.id}
                  className={`${styles.card} ${focusedIndex === i ? styles.cardFocused : ''} ${selectedVideo?.id === v.id ? styles.cardSelected : ''}`}
                  onMouseEnter={() => setFocusedIndex(i)}
                  onFocus={() => setFocusedIndex(i)}
                  onKeyDown={onKeyDown}
                  onClick={() => handleVideoSelect(v)}
                  aria-label={`Chọn video ${v.title} từ kênh ${v.channel}`}
                >
                  <div className={styles.thumbWrap}>
                    <div className={styles.thumb} style={{ backgroundImage: `url(${v.thumb})` }} />
                    <span className={styles.duration}>{formatIsoDuration(v.durationIso)}</span>
                  </div>
                  <div className={styles.meta}>
                    <div className={styles.title}>{v.title}</div>
                    <div className={styles.channel}>{v.channel}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className={styles.pagination}>
            <button 
              disabled={!prevToken || loading} 
              onClick={() => runSearch(query || activeChip || 'Bài tập mắt', prevToken || undefined)} 
              className={`${styles.paginationBtn} ${styles.paginationPrev}`}
            >
              ← Trang trước
            </button>
            <button 
              disabled={!nextToken || loading} 
              onClick={() => runSearch(query || activeChip || 'Bài tập mắt', nextToken || undefined)} 
              className={`${styles.paginationBtn} ${styles.paginationNext}`}
            >
              Trang sau →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}


