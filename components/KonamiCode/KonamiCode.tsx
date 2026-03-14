'use client';

import { useEffect, useState } from 'react';
import styles from './KonamiCode.module.scss';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const KonamiCode = () => {
  const [position, setPosition] = useState(0);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const expectedKey = KONAMI_SEQUENCE[position];
      
      if (e.key === expectedKey || e.key.toLowerCase() === expectedKey.toLowerCase()) {
        const newPosition = position + 1;
        setPosition(newPosition);
        
        if (newPosition === KONAMI_SEQUENCE.length) {
          setActivated(true);
          setPosition(0);
        }
      } else {
        setPosition(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position]);

  useEffect(() => {
    if (activated) {
      const timer = setTimeout(() => setActivated(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [activated]);

  if (!activated) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h2>🎉 You found the secret!</h2>
        <p>Congratulations, you unlocked the Konami code!</p>
        <div className={styles.emoji}>
          <span>🛡️</span>
          <span>🎮</span>
          <span>✨</span>
        </div>
        <p className={styles.signature}>- Milo</p>
      </div>
    </div>
  );
};
