import type { ArtistTrend } from '../data.types';
import { ArtistImage } from './ArtistImage';
import styles from './ArtistTrends.module.scss';

function TrendList({ title, trends, direction }: { title: string; trends: ArtistTrend[]; direction: 'up' | 'down' }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{title}</h2>
      <div className={styles.list}>
        {trends.map((trend, i) => (
          <div key={trend.artist} className={`${styles.row} ${i % 2 === 1 ? styles.rowAlt : ''}`}>
            <ArtistImage src={trend.imageUrl ?? ''} alt={trend.artist} size={32} />
            <span className={styles.artist}>{trend.artist}</span>
            <span className={styles.counts}>
              {trend.previousCount} → {trend.currentCount}
            </span>
            <span className={`${styles.change} ${styles[direction]}`}>
              {direction === 'up' ? '↑' : '↓'} {Math.abs(Math.round(trend.percentChange))}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArtistTrends({ trends }: { trends: ArtistTrend[] }) {
  const rising = trends.filter((t) => t.percentChange >= 0).sort((a, b) => b.percentChange - a.percentChange);
  const falling = trends.filter((t) => t.percentChange < 0).sort((a, b) => a.percentChange - b.percentChange);

  return (
    <div className={styles.wrapper}>
      <TrendList title="Trending Up" trends={rising} direction="up" />
      <TrendList title="Trending Down" trends={falling} direction="down" />
    </div>
  );
}
