import type { MonthlyTopArtist } from '../data.types';
import { ArtistImage } from './ArtistImage';
import styles from './MonthlyLeaderboard.module.scss';

export function MonthlyLeaderboard({ months }: { months: MonthlyTopArtist[] }) {
  const maxCount = Math.max(...months.map((m) => m.count), 1);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Top Artist Each Month</h2>
      <div className={styles.list}>
        {months.map((month, i) => (
          <div key={month.month} className={`${styles.row} ${i % 2 === 1 ? styles.rowAlt : ''}`}>
            <span className={styles.month}>{month.monthName.slice(0, 3)}</span>
            <ArtistImage src={month.imageUrl ?? ''} alt={month.artist} size={32} />
            <div className={styles.barContainer}>
              <div className={styles.bar} style={{ width: `${(month.count / maxCount) * 100}%` }} />
              <span className={styles.name}>{month.artist}</span>
            </div>
            <span className={styles.count}>{month.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
