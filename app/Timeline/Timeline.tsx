import { FEED_PAGE_SIZE, getMonthSummaries } from 'data-access/feed/getMonthSummaries';
import { TimelineStream } from './TimelineStream';
import styles from './Timeline.module.scss';

export const TimelineSkeleton = () => (
  <section className={styles.feed} aria-hidden="true">
    <span className={styles.yarn} />
    <ol className={styles.months}>
      {[0, 1, 2].map((i) => (
        <li key={i} className={styles.row}>
          <span className={styles.rail} />
          <div className={styles.skeleton} />
        </li>
      ))}
    </ol>
  </section>
);

export const Timeline = async () => {
  const all = await getMonthSummaries();
  if (!all.length) return null;

  const months = all.slice(0, FEED_PAGE_SIZE);
  const done = months.length >= all.length;

  return (
    <section className={styles.feed} aria-label="Life feed">
      <span className={styles.hanger} aria-hidden="true">
        <span className={styles.scrap}>what I&apos;ve been up to</span>
        <span className={styles.pin} />
      </span>
      <span className={styles.yarn} aria-hidden="true" />
      <TimelineStream
        initial={{
          months,
          nextCursor: done ? null : months[months.length - 1].key,
          done,
        }}
      />
    </section>
  );
};
