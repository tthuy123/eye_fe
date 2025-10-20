// src/app/watches/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './watches.module.css';

type VideoItem = {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumb: string;
};

const demoVideos: VideoItem[] = [
  { id: '1', title: 'Bài tập vận động mắt cơ bản', channel: 'Eye Health', duration: '12:32', thumb: '/thumbs/thumb1.jpg' },
  { id: '2', title: 'Thiền thư giãn cho mắt - 10 phút', channel: 'Calm Vision', duration: '10:01', thumb: '/thumbs/thumb2.jpg' },
  { id: '3', title: 'Theo dõi điểm nhìn: Hướng dẫn nhanh', channel: 'Vision Lab', duration: '08:45', thumb: '/thumbs/thumb3.jpg' },
  { id: '4', title: 'Bài tập chớp mắt và tập trung', channel: 'Well Eyes', duration: '06:27', thumb: '/thumbs/thumb4.jpg' },
  { id: '5', title: 'Âm thanh tự nhiên thư giãn cho mắt', channel: 'Nature Focus', duration: '03:55', thumb: '/thumbs/thumb5.jpg' },
  { id: '6', title: 'Hít thở nhịp nhàng cùng ánh sáng', channel: 'Breathe & See', duration: '15:20', thumb: '/thumbs/thumb6.jpg' },
];

const suggestionChips = ['Thư giãn', 'Bài tập mắt', 'Tập trung', 'Âm thanh', 'Thiền', 'Hướng dẫn'];

export default function WatchesPage() {
  const [query, setQuery] = useState('');
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeChip) setQuery(activeChip);
  }, [activeChip]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return demoVideos;
    return demoVideos.filter(v => v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q));
  }, [query]);

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
    }
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
          />
          <button className={styles.voiceBtn} aria-label="Tìm kiếm bằng giọng nói">🎙️</button>
        </div>
        <div className={styles.chips}>
          {suggestionChips.map((c) => (
            <button
              key={c}
              className={`${styles.chip} ${activeChip === c ? styles.chipActive : ''}`}
              onClick={() => setActiveChip(activeChip === c ? null : c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.playerPanel}>
          <div className={styles.playerMock}>
            <div className={styles.playerScrim} />
            <button className={styles.playerPlay} aria-label="Phát video">▶</button>
          </div>
          <div className={styles.playerMeta}>
            <h2 className={styles.videoTitle}>Tiêu đề video đang chọn</h2>
            <div className={styles.videoChannel}>Kênh: Eye Health</div>
          </div>
        </div>

        <div className={styles.resultsPanel}>
          <div className={styles.resultsGrid}>
            {results.map((v, i) => (
              <button
                key={v.id}
                className={`${styles.card} ${focusedIndex === i ? styles.cardFocused : ''}`}
                onMouseEnter={() => setFocusedIndex(i)}
                onFocus={() => setFocusedIndex(i)}
                onKeyDown={onKeyDown}
                aria-label={`Chọn video ${v.title} từ kênh ${v.channel}`}
              >
                <div className={styles.thumbWrap}>
                  <div className={styles.thumb} style={{ backgroundImage: `url(${v.thumb})` }} />
                  <span className={styles.duration}>{v.duration}</span>
                </div>
                <div className={styles.meta}>
                  <div className={styles.title}>{v.title}</div>
                  <div className={styles.channel}>{v.channel}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}


