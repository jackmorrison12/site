'use client';

import { useRef, useEffect, useState } from 'react';

const CV_WIDTH_PX = 210 * 3.7795275591; // 210mm at 96dpi

export function CvScaler({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const observer = new ResizeObserver((entries) => {
      const containerWidth = entries[0].contentBoxSize[0].inlineSize;
      const newScale = Math.min(1, containerWidth / CV_WIDTH_PX);
      setScale(newScale);
      setScaledHeight(newScale < 1 ? content.scrollHeight * newScale : undefined);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: scaledHeight, overflow: 'hidden' }}>
      <div
        ref={contentRef}
        style={{
          width: CV_WIDTH_PX,
          margin: '0 auto',
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}
