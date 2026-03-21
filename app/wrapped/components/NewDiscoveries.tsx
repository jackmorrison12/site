import type { ArtistWithCount } from '../data.types';
import styles from './NewDiscoveries.module.scss';

export function NewDiscoveries({ artists }: { artists: ArtistWithCount[] }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>New Discoveries</h2>
      <div className={styles.pills}>
        {artists.map((artist) => (
          <span key={artist.artist} className={styles.pill}>
            {artist.artist}
            <span className={styles.count}>{artist.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
