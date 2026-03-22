import type { ArtistWithCount } from '../data.types';
import { ArtistImage } from './ArtistImage';
import styles from './NewDiscoveries.module.scss';

export function NewDiscoveries({ artists }: { artists: ArtistWithCount[] }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>New Discoveries</h2>
      <div className={styles.list}>
        {artists.map((artist, i) => (
          <div key={artist.artist} className={`${styles.row} ${i % 2 === 1 ? styles.rowAlt : ''}`}>
            <ArtistImage src={artist.imageUrl ?? ''} alt={artist.artist} size={32} />
            <span className={styles.name}>{artist.artist}</span>
            <span className={styles.count}>{artist.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
