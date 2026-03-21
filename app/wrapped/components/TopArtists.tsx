import type { ArtistWithCount } from '../data.types';
import styles from './TopArtists.module.scss';

export function TopArtists({ artists }: { artists: ArtistWithCount[] }) {
  const maxCount = artists[0]?.count ?? 1;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Top Artists</h2>
      <div className={styles.list}>
        {artists.map((artist, i) => (
          <div key={artist.artist} className={`${styles.row} ${i % 2 === 1 ? styles.rowAlt : ''}`}>
            <span className={styles.rank}>{i + 1}</span>
            <div className={styles.name}>{artist.artist}</div>
            <div className={styles.barContainer}>
              <div className={styles.bar} style={{ width: `${(artist.count / maxCount) * 100}%` }} />
            </div>
            <span className={styles.count}>{artist.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
