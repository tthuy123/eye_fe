// src/app/watches/page.tsx
'use client';

import AppHeader from '@/component/layout/AppHeader';
import GazeButton from '@/component/gazeButton';
import { useEffect, useRef, useState } from 'react';
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

export default function WatchesPage() {
  const [query, setQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<VideoItem[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevToken, setPrevToken] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    // initial load with a helpful default
    if (results.length === 0 && !loading) {
      void runSearch('Bài tập mắt');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showKeyboard) {
      inputRef.current?.focus();
    }
  }, [showKeyboard]);

  const runSearch = async (q: string, pageToken?: string) => {
    const term = (q || '').trim() || 'Bài tập mắt';
    setLoading(true);
    setError(null);
    setPlayerLoading(true);
    try {
      const res = await fetch('/api/youtube/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: term, pageToken }),
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
      const q = query.trim() || 'Bài tập mắt';
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

  const handleKeyboardAdd = (char: string) => {
    setQuery(prev => prev + char);
  };

  const handleKeyboardSpace = () => {
    setQuery(prev => `${prev} `);
  };

  const handleKeyboardBackspace = () => {
    setQuery(prev => prev.slice(0, -1));
  };

  const handleKeyboardClear = () => {
    setQuery('');
  };

  const handleKeyboardSearch = () => {
    void runSearch(query);
    setShowKeyboard(false);
  };

  const keyboardLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className={styles.pageRoot}>
      <AppHeader />

      <main className={styles.pageWrapper}>
        <section className={styles.searchSection}>
          <div className={styles.searchBarWrap}>
            <GazeButton
              onClick={() => {
                setShowKeyboard(true);
                inputRef.current?.blur();
              }}
              className={styles.gazeTrigger}
            >
              <span className={styles.gazeIcon}>🔍</span>
              <span className={query ? styles.gazeText : styles.gazePlaceholder}>
                {query || 'Nhìn vào đây để nhập từ khóa tìm kiếm'}
              </span>
            </GazeButton>
            <GazeButton onClick={() => runSearch(query)} disabled={loading} className={styles.searchBtn}>
              {loading ? 'Đang tìm…' : 'Tìm kiếm'}
            </GazeButton>
            <input
              ref={inputRef}
              className={styles.hiddenInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Ô tìm kiếm video ẩn"
            />
          </div>
          <div>{error ? <div style={{ color: 'salmon', marginTop: '0.5rem' }}>{error}</div> : null}</div>
        </section>

        <section className={styles.main}>
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
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={handlePlayerLoad}
                />
              ) : (
                <div className={styles.playerPlaceholder}>
                  <GazeButton
                    className={styles.playerPlay}
                    aria-label="Phát video"
                    onClick={() => {
                      setShowKeyboard(true);
                      inputRef.current?.blur();
                    }}
                  >
                    ▶
                  </GazeButton>
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
                  <GazeButton
                    key={v.id}
                    className={`${styles.card} ${focusedIndex === i ? styles.cardFocused : ''} ${selectedVideo?.id === v.id ? styles.cardSelected : ''}`}
                    onMouseEnter={() => setFocusedIndex(i)}
                    onFocus={() => setFocusedIndex(i)}
                    onKeyDown={onKeyDown}
                    onClick={() => handleVideoSelect(v)}
                    layoutMode="block"
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
                  </GazeButton>
                ))}
              </div>
            )}
            <div className={styles.pagination}>
              <GazeButton
                disabled={!prevToken || loading}
                onClick={() => runSearch(query, prevToken || undefined)}
                className={`${styles.paginationBtn} ${styles.paginationPrev}`}
              >
                ← Trang trước
              </GazeButton>
              <GazeButton
                disabled={!nextToken || loading}
                onClick={() => runSearch(query, nextToken || undefined)}
                className={`${styles.paginationBtn} ${styles.paginationNext}`}
              >
                Trang sau →
              </GazeButton>
            </div>
          </div>
        </section>
      </main>

      {showKeyboard ? (
        <div className={styles.keyboardOverlay} role="dialog" aria-modal="true">
          <div className={styles.keyboardContainer}>
            <div className={styles.keyboardTop}>
              <GazeButton onClick={() => setShowKeyboard(false)} className={styles.keyboardClose}>
                ← Trở lại
              </GazeButton>
              <div className={styles.keyboardDisplay}>
                {query ? <span>{query}</span> : <span className={styles.keyboardPlaceholder}>Nhập từ khóa tìm kiếm…</span>}
              </div>
            </div>

            <div className={styles.keyboardGrid}>
              {keyboardLetters.map(letter => (
                <GazeButton key={letter} onClick={() => handleKeyboardAdd(letter)} className={styles.keyboardKey}>
                  {letter}
                </GazeButton>
              ))}
            </div>

            <div className={styles.keyboardActions}>
              <GazeButton onClick={handleKeyboardSpace} className={styles.keyboardAction}>
                Space
              </GazeButton>
              <GazeButton onClick={handleKeyboardBackspace} className={styles.keyboardAction}>
                Xóa
              </GazeButton>
              <GazeButton onClick={handleKeyboardClear} className={styles.keyboardAction}>
                Xóa hết
              </GazeButton>
              <GazeButton
                onClick={handleKeyboardSearch}
                className={`${styles.keyboardAction} ${styles.keyboardActionPrimary}`}
              >
                Tìm kiếm
              </GazeButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
