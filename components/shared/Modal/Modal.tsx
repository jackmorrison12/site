'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!panelRef.current?.contains(e.target as Node)) {
      router.back();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.panel} ref={panelRef}>
        <button className={styles.closeButton} onClick={() => router.back()} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
