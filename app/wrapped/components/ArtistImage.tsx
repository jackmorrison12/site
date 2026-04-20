'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ArtistImage.module.scss';

export function ArtistImage({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={styles.fallback} style={{ width: size, height: size }}>
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={src}
      width={size}
      height={size}
      alt={alt}
      className={styles.image}
      onError={() => setFailed(true)}
    />
  );
}
