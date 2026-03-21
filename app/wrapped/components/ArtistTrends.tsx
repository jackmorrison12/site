import type { ArtistTrend } from '../data.types';
import styles from './ArtistTrends.module.scss';

export function ArtistTrends({ trends }: { trends: ArtistTrend[] }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Year-over-Year Trends</h2>
      <div className={styles.list}>
        {trends.map((trend) => (
          <div key={trend.artist} className={styles.row}>
            <span className={styles.artist}>{trend.artist}</span>
            <span className={styles.count}>{trend.currentCount}</span>
            <span className={`${styles.change} ${trend.percentChange >= 0 ? styles.up : styles.down}`}>
              {trend.percentChange >= 0 ? '\u2191' : '\u2193'} {Math.abs(Math.round(trend.percentChange))}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
