// src/app/page.tsx
'use client';

import NavigationButton from '@/component/button/navigationButton';
import AppHeader from '@/component/layout/AppHeader';
import GazeButton from '@/component/gazeButton';
import { useRouter } from 'next/navigation';
import styles from './home.module.css';

const navigationItems = [
  { name: 'XEM YOUTUBE', description: 'Video, tìm kiếm & điều khiển bằng giọng nói.', href: '/watches' },
  { name: 'ĐỌC TRUYỆN', description: 'Truyện chữ, sách nói & điều khiển bằng giọng nói.', href: '/books' },
  { name: 'TRÒ CHƠI', description: '1-2 Game vận động mắt đơn giản.', href: '/games' },
  { name: 'HỖ TRỢ GIỌNG NÓI', description: 'Thiết lập và điều khiển toàn bộ ứng dụng.', href: '/voice-config' },
];

const Logo = () => (
  <div className={styles.logoContainer}>
    <div className={styles.logoCircle}>
      <div className={styles.logoEye}>
        <div className={styles.logoPupil}></div>
      </div>
    </div>
    <div className={styles.logoText}>
      <span className={styles.logoMain}>EYE</span>
      <span className={styles.logoSub}>WEB</span>
    </div>
  </div>
);

const HomePage = () => {
  const router = useRouter();

  return (
    <div className={styles.pageRoot}>
      <AppHeader />

      <main className={styles.mainContentWrapper}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <span className={styles.tagline}>PROJECT EYE FE</span>

            <h1 className={styles.headerTitle}>WEB HỖ TRỢ VẬN ĐỘNG</h1>

            <p className={styles.headerSubtitle}>
              Giao diện tối ưu cho người dùng điều khiển bằng mắt và giọng nói.
            </p>

            <div className={styles.heroActions}>
              <NavigationButton href="/guide" label="Hướng dẫn sử dụng" variant="primary" />
              <NavigationButton href="/voice-config" label="Cài đặt giọng nói" variant="subtle" />
            </div>
          </div>

          <div className={styles.logoSection}>
            <Logo />
          </div>
        </section>

        <section aria-label="Lối tắt chức năng" className={styles.navigationGrid}>
          {navigationItems.map((item) => (
            <GazeButton
              key={item.name}
              className={styles.navCard}
              onClick={() => router.push(item.href)}
              layoutMode="block"
            >
              <span className={styles.cardTitle}>{item.name}</span>
              <p className={styles.cardDescription}>{item.description}</p>
            </GazeButton>
          ))}
        </section>
      </main>
    </div>
  );
};

export default HomePage;