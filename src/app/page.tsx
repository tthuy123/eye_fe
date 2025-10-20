// src/app/page.tsx
'use client';

import Link from 'next/link';
import styles from './home.module.css'; // Đảm bảo đã import

// Tạm dùng icon đơn giản hoặc chữ cái đại diện
const iconMap: { [key: string]: string } = {
  'XEM YOUTUBE': '▶',
  'ĐỌC TRUYỆN': '📚',
  'TRÒ CHƠI': '🎮',
  'HỖ TRỢ GIỌNG NÓI': '🎙️' 
};

// Định nghĩa các trang chính (Giữ nguyên)
const navigationItems = [
  { name: 'XEM YOUTUBE', description: 'Video, tìm kiếm & điều khiển bằng giọng nói.', href: '/watches' },
  { name: 'ĐỌC TRUYỆN', description: 'Truyện chữ, sách nói & điều khiển bằng giọng nói.', href: '/stories' },
  { name: 'TRÒ CHƠI', description: '1-2 Game vận động mắt đơn giản.', href: '/games' },
  { name: 'HỖ TRỢ GIỌNG NÓI', description: 'Thiết lập và điều khiển toàn bộ ứng dụng.', href: '/voice-config' }, 
];

// Component Logo đơn giản
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

// Component cho Navbar
const Navbar = () => (
  <nav className={styles.navBar}> 
    <div className="flex justify-between items-center w-full">
      {/* Logo/Tên dự án */}
      <Link href="/" className={`${styles.navLink} text-2xl font-black`}>
        EYE WEB
      </Link>
      
      {/* Menu bên phải */}
      <div className="flex items-center space-x-6 text-base font-medium">
        <Link href="/glossary" className={styles.navLink}>Glossary</Link>
        <Link href="/backups" className={styles.navLink}>Backups</Link>
        <Link href="/ecosystem" className={styles.navLink}>Ecosystem</Link>
        <button className="text-2xl ml-4">☰</button> {/* Nút menu/cài đặt */}
      </div>
    </div>
  </nav>
);


const HomePage = () => {
  return (
    <div className={styles.container}>
        <Navbar />
        
        <div className={styles.mainContentWrapper}>
          
          {/* --- HERO SECTION VỚI LOGO --- */}
          <div className={styles.heroSection}>
            {/* Hero Content bên trái */}
            <div className={styles.heroContent}> 
              <span className={styles.tagline}>
                PROJECT EYE FE
              </span>
              
              <h1 className={styles.headerTitle}>
                WEB HỖ TRỢ VẬN ĐỘNG
              </h1>
              
              <p className={styles.headerSubtitle}>
                Giao diện được thiết kế tối ưu cho người dùng điều khiển bằng mắt và giọng nói.
              </p>

              {/* --- NÚT HÀNH ĐỘNG CHÍNH --- */}
              <div className="mt-8 space-x-4"> 
                <Link href="/guide" className={styles.actionButton}>
                  Hướng Dẫn Sử Dụng
                </Link>
                <Link href="/voice-config" className={styles.actionButton}> 
                  Cài Đặt Giọng Nói
                </Link>
              </div>
            </div>

            {/* Logo bên phải */}
            <div className={styles.logoSection}>
              <Logo />
            </div>
          </div>

          {/* --- BỐ CỤC THẺ NỘI DUNG (4 CỘT) --- */}
          {/* Giữ nguyên để căn giữa */}
          <h2 className={styles.gridTitle}>HOẶC DUYỆT QUA CÁC TRANG CHÍNH</h2>

          <div className={styles.navigationGrid}>
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href} className={styles.navCard}>
                <div className={styles.cardIcon}>
                  {iconMap[item.name] || '📄'}
                </div>
                <div className={styles.cardTitle}>
                  {item.name}
                </div>
                <p className={styles.cardDescription}>
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
    </div>
  );
};

export default HomePage;