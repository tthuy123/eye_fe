'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import GazeButton from '@/component/gazeButton';
import styles from './appHeader.module.css';

const NAV_ITEMS = [
  { href: '/watches', label: 'Xem YouTube' },
  { href: '/books', label: 'Đọc sách' },
  { href: '/games', label: 'Trò chơi' },
  { href: '/voice-config', label: 'Giọng nói' },
];

const BrandMark = () => (
  <span className={styles.brandMark}>
    <span className={styles.brandEye}>
      <span className={styles.brandPupil} />
    </span>
  </span>
);

const isActive = (pathname: string, href: string) => {
  if (href === '/') {
    return pathname === '/';
  }
  if (href === '/books') {
    return pathname.startsWith('/book') || pathname.startsWith('/books');
  }
  return pathname.startsWith(href);
};

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`${styles.headerRoot} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.headerInner}>
          <GazeButton
            className={styles.brand}
            aria-label="Eye Web về trang chủ"
            layoutMode="flex"
            onClick={() => router.push('/')}
          >
            <BrandMark />
            <span className={styles.brandText}>
              <span className={styles.brandName}>Eye Web</span>
              <span className={styles.brandSub}>Hỗ trợ điều hướng</span>
            </span>
          </GazeButton>

          <nav className={styles.nav} aria-label="Điều hướng chính">
            {NAV_ITEMS.map((item) => (
              <GazeButton
                key={item.href}
                className={`${styles.navLink} ${isActive(pathname, item.href) ? styles.navLinkActive : ''}`}
                onClick={() => {
                  router.push(item.href);
                }}
              >
                {item.label}
              </GazeButton>
            ))}
          </nav>

          <GazeButton
            type="button"
            aria-label="Mở điều hướng"
            className={styles.mobileToggle}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className={`${styles.toggleBar} ${open ? styles.toggleTopOpen : ''}`} />
            <span className={`${styles.toggleBar} ${open ? styles.toggleMiddleOpen : ''}`} />
            <span className={`${styles.toggleBar} ${open ? styles.toggleBottomOpen : ''}`} />
          </GazeButton>
        </div>
      </header>

      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ''}`}>
        {NAV_ITEMS.map((item) => (
          <GazeButton
            key={item.href}
            className={`${styles.mobileLink} ${isActive(pathname, item.href) ? styles.mobileLinkActive : ''}`}
            onClick={() => {
              router.push(item.href);
              setOpen(false);
            }}
            layoutMode="block"
          >
            {item.label}
          </GazeButton>
        ))}
      </div>
    </>
  );
}

