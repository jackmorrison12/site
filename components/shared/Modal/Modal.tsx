'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import styles from './Modal.module.css';

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!panelRef.current?.contains(e.target as Node)) {
      router.back();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      onKeyDown={(e) => e.key === 'Escape' && router.back()}
      tabIndex={-1}
      autoFocus
    >
      <div className={styles.panel} ref={panelRef}>
        <button className={styles.closeButton} onClick={() => router.back()} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
