// src/app/page.tsx
'use client';

import Link from 'next/link';
import styles from './home.module.css'; // Đảm bảo đã import
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
  { name: 'ĐỌC TRUYỆN', description: 'Truyện chữ, sách nói & điều khiển bằng giọng nói.', href: '/books' },
  { name: 'TRÒ CHƠI', description: '1-2 Game vận động mắt đơn giản.', href: '/games' },
  { name: 'HỖ TRỢ GIỌNG NÓI', description: 'Thiết lập và điều khiển toàn bộ ứng dụng.', href: '/voice-config' }, 
];

// Component Logo đơn giản (dùng cho hero)
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

// Component Logo nhỏ (dùng cho navbar)
const MiniLogo = () => (
  <div className={styles.miniLogo} aria-label="EYE WEB home">
    <div className={styles.miniLogoCircle}>
      <div className={styles.miniLogoEye}>
        <div className={styles.miniLogoPupil}></div>
      </div>
    </div>
  </div>
);

// Component cho Navbar (hiện đại, responsive, gọn)
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navClasses = `${styles.navBar} ${scrolled ? styles.navBarScrolled : ''}`;

  return (
    <nav className={navClasses}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.navBrand}>
          <MiniLogo />
        </Link>

        <div className={styles.navMenu}>
          <Link href="/watches" className={`${styles.navLink} ${pathname === '/watches' ? styles.activeLink : ''}`}>YouTube</Link>
          <Link href="/stories" className={`${styles.navLink} ${pathname === '/stories' ? styles.activeLink : ''}`}>Đọc truyện</Link>
          <Link href="/games" className={`${styles.navLink} ${pathname === '/games' ? styles.activeLink : ''}`}>Trò chơi</Link>
          <Link href="/voice-config" className={`${styles.navLink} ${pathname === '/voice-config' ? styles.activeLink : ''}`}>Cài đặt giọng nói</Link>
        </div>

        <button aria-label="Toggle menu" className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
          <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineTopOpen : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineMiddleOpen : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineBottomOpen : ''}`}></span>
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}>
        <Link href="/watches" className={styles.mobileNavLink}>YouTube</Link>
        <Link href="/stories" className={styles.mobileNavLink}>Đọc truyện</Link>
        <Link href="/games" className={styles.mobileNavLink}>Trò chơi</Link>
        <Link href="/voice-config" className={styles.mobileNavLink}>Cài đặt giọng nói</Link>
      </div>
    </nav>
  );
};

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
                Giao diện tối ưu cho người dùng điều khiển bằng mắt và giọng nói.
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