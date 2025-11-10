'use client';

import { useRouter } from 'next/navigation';
import GazeButton from '@/component/gazeButton';
import styles from './navigationButton.module.css';

type Variant = 'primary' | 'subtle' | 'ghost';

type NavigationButtonProps = {
  href: string;
  label: string;
  variant?: Variant;
  icon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
};

const merge = (...tokens: Array<string | false | null | undefined>) =>
  tokens.filter(Boolean).join(' ');

export default function NavigationButton({
  href,
  label,
  variant = 'primary',
  icon,
  className,
  fullWidth = false,
}: NavigationButtonProps) {
  const router = useRouter();

  return (
    <GazeButton
      className={merge(
        styles.buttonBase,
        styles[variant],
        fullWidth ? styles.wide : undefined,
        className,
      )}
      onClick={() => router.push(href)}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.label}>{label}</span>
    </GazeButton>
  );
}

