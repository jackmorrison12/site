import type { SummaryStats } from '../data.types';
import styles from './SummaryCards.module.scss';

export function SummaryCards({ stats, year }: { stats: SummaryStats; year: number }) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.number}>{stats.totalListens.toLocaleString()}</div>
        <div className={styles.label}>total listens in {year}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.number}>{stats.uniqueTracks.toLocaleString()}</div>
        <div className={styles.label}>unique tracks</div>
      </div>
      <div className={styles.card}>
        <div className={styles.number}>{stats.uniqueArtists.toLocaleString()}</div>
        <div className={styles.label}>unique artists</div>
      </div>
    </div>
  );
}
