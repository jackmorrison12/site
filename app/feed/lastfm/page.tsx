import styles from './lastfm.module.scss';
import { db } from 'drizzle/db';
import { listens, tracks } from 'drizzle/schema';
import { count, desc, eq, gte } from 'drizzle-orm';
import Image from 'next/image';
import { RefreshButton } from './RefreshButton';

export default async function Page() {
  const topTracks = await db
    .select({
      name: tracks.name,
      artist: tracks.artist,
      count: count(listens.id),
      id: tracks.id,
      imageUrl: tracks.imageUrl,
    })
    .from(listens)
    .innerJoin(tracks, eq(listens.id, tracks.id))
    .where(gte(listens.time, new Date(2024, 1, 1)))
    .groupBy(listens.id, tracks.name, tracks.artist, tracks.id, tracks.imageUrl)
    .orderBy(desc(count(listens.id)))
    .limit(100);

  return (
    <div>
      <h1>My 2024 Spotify Wrapped... so far</h1>
      <RefreshButton />
      {topTracks.map((t) => (
        <div key={t.id} className={styles.trackWrapper}>
          {t.imageUrl && <Image src={t.imageUrl} width={50} height={50} alt={`Cover art for ${t.name}`} />}
          {t.name} - {t.artist} - {t.count} listens
        </div>
      ))}
    </div>
  );
}

export const metadata = {
  title: 'LastFM',
  description: 'My recent LastFM activity',
};
