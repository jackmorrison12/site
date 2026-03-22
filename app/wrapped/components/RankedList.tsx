import { ArtistImage } from './ArtistImage';
import styles from './RankedList.module.scss';

export type RankedItem = {
  key: string;
  imageUrl: string | null;
  imageAlt: string;
  title: string;
  subtitle?: string;
  count: number;
};

export function RankedList({
  heading,
  items,
  barColor = 'primary',
}: {
  heading: string;
  items: RankedItem[];
  barColor?: 'primary' | 'secondary';
}) {
  const maxCount = items[0]?.count ?? 1;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.list}>
        {items.map((item, i) => (
          <div key={item.key} className={`${styles.row} ${i % 2 === 1 ? styles.rowAlt : ''}`}>
            <span className={styles.rank}>{i + 1}</span>
            <ArtistImage src={item.imageUrl ?? ''} alt={item.imageAlt} size={40} />
            <div className={styles.info}>
              <div className={styles.title}>{item.title}</div>
              {item.subtitle && <div className={styles.subtitle}>{item.subtitle}</div>}
            </div>
            <div className={styles.barContainer}>
              <div
                className={`${styles.bar} ${barColor === 'secondary' ? styles.barSecondary : ''}`}
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
            <span className={styles.count}>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
