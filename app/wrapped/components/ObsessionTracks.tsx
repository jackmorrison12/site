import type { WeeklyObsession } from '../data.types';
import { ArtistImage } from './ArtistImage';
import styles from './ObsessionTracks.module.scss';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatWeek(date: Date) {
  const weekOfMonth = Math.ceil(date.getUTCDate() / 7);
  return `${getOrdinal(weekOfMonth)} week of ${MONTHS[date.getUTCMonth()]}`;
}

export function ObsessionTracks({ obsessions }: { obsessions: WeeklyObsession[] }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Obsessions</h2>
      <div className={styles.list}>
        {obsessions.map((track) => (
          <div key={`${track.id}-${track.weekDate.toISOString()}`} className={styles.card}>
            <ArtistImage src={track.imageUrl ?? ''} alt={track.name} size={80} />
            <div className={styles.info}>
              <div className={styles.trackName}>{track.name}</div>
              <div className={styles.artistName}>{track.artist}</div>
              <div className={styles.badge}>{track.count} plays in one week</div>
              <div className={styles.week}>{formatWeek(track.weekDate)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
