import type { ArtistTrend } from '../data.types';
import { ArtistImage } from './ArtistImage';
import styles from './ArtistTrends.module.scss';

export function ArtistTrends({ trends }: { trends: ArtistTrend[] }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Year-over-Year Trends</h2>
      <div className={styles.list}>
        {trends.map((trend, i) => (
          <div key={trend.artist} className={`${styles.row} ${i % 2 === 1 ? styles.rowAlt : ''}`}>
            <ArtistImage src={trend.imageUrl ?? ''} alt={trend.artist} size={32} />
            <span className={styles.artist}>{trend.artist}</span>
            <span className={styles.counts}>
              {trend.previousCount} → {trend.currentCount}
            </span>
            <span className={`${styles.change} ${trend.percentChange >= 0 ? styles.up : styles.down}`}>
              {trend.percentChange >= 0 ? '\u2191' : '\u2193'} {Math.abs(Math.round(trend.percentChange))}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
