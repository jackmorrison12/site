import Image from 'next/image';
import type { TrackWithCount } from '../data.types';
import styles from './TopTracks.module.scss';

export function TopTracks({ tracks }: { tracks: TrackWithCount[] }) {
  const maxCount = tracks[0]?.count ?? 1;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Top Tracks</h2>
      <div className={styles.list}>
        {tracks.map((track, i) => (
          <div key={track.id} className={`${styles.row} ${i % 2 === 1 ? styles.rowAlt : ''}`}>
            <span className={styles.rank}>{i + 1}</span>
            {track.imageUrl && (
              <Image
                src={track.imageUrl}
                width={64}
                height={64}
                alt={`Cover art for ${track.name}`}
                className={styles.art}
              />
            )}
            <div className={styles.info}>
              <div className={styles.trackName}>{track.name}</div>
              <div className={styles.artistName}>{track.artist}</div>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.bar} style={{ width: `${(track.count / maxCount) * 100}%` }} />
            </div>
            <span className={styles.count}>{track.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
