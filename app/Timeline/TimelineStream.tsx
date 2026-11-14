'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FeedPage, MonthSummary } from 'data-access/feed/feed.types';
import { MonthCard } from './MonthCard';
import styles from './Timeline.module.scss';

const Rail = () => (
  <span className={styles.rail} aria-hidden="true">
    <span className={styles.monthPin} />
  </span>
);

export const TimelineStream = ({ initial }: { initial: FeedPage }) => {
  const [months, setMonths] = useState<MonthSummary[]>(initial.months);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [done, setDone] = useState(initial.done);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);

  const loadMore = useCallback(async () => {
    if (inFlight.current || done || !cursor) return;
    inFlight.current = true;
    setLoading(true);
    try {
      const res = await fetch(`/api/feed?cursor=${encodeURIComponent(cursor)}`);
      if (!res.ok) throw new Error(`Feed request failed: ${res.status}`);
      const page = (await res.json()) as FeedPage;
      setMonths((prev) => [...prev, ...page.months]);
      setCursor(page.nextCursor);
      setDone(page.done);
    } catch {
      // Stop rather than retry forever — the months already loaded still read fine.
      setDone(true);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [cursor, done]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || done) return;

    // Fires well before the sentinel is visible so scrolling never stalls.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '1200px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, done]);

  return (
    <>
      <ol className={styles.months}>
        {months.map((month) => (
          <li key={month.key} className={styles.row}>
            <Rail />
            <MonthCard month={month} />
          </li>
        ))}
      </ol>

      {!done && <div ref={sentinel} className={styles.sentinel} aria-hidden="true" />}
      {loading && <p className={styles.loading}>Loading…</p>}
    </>
  );
};
