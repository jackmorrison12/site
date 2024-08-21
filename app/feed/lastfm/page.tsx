import styles from './lastfm.module.scss';
import { db } from 'drizzle/db';
import { listens, tracks } from 'drizzle/schema';
import { count, desc, eq, gte, sum } from 'drizzle-orm';
import Image from 'next/image';
import { RefreshButton } from './RefreshButton';
import Link from 'next/link';

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
    .where(gte(listens.time, new Date(2024, 0, 1)))
    .groupBy(listens.id, tracks.name, tracks.artist, tracks.id, tracks.imageUrl)
    .orderBy(desc(count(listens.id)))
    .limit(100);

  const sq = db
    .select({
      id: listens.id,
      count: count(listens.id).as('count'),
    })
    .from(listens)
    .where(gte(listens.time, new Date(2024, 0, 1)))
    .groupBy(listens.id)
    .orderBy(desc(count(listens.id)))
    .as('sq');

  const topArtists = await db
    .select({ artist: tracks.artist, sum: sum(sq.count) })
    .from(tracks)
    .innerJoin(sq, eq(tracks.id, sq.id))
    .groupBy(tracks.artist)
    .orderBy(desc(sum(sq.count)))
    .limit(100);

  return (
    <div>
      <h1>My 2024 Spotify Wrapped... so far</h1>
      <RefreshButton />
      <div className={styles.listsWrapper}>
        <div>
          <h2>Top Tracks</h2>
          {topTracks.map((t) => (
            <div key={t.id} className={styles.trackWrapper}>
              {t.imageUrl && <Image src={t.imageUrl} width={50} height={50} alt={`Cover art for ${t.name}`} />}
              {t.name} - <Link href={`/feed/lastfm/artist/${t.artist}`}>{t.artist}</Link> - {t.count} listens
            </div>
          ))}
        </div>
        <div>
          <h2>Top Artists</h2>
          {topArtists.map((a) => (
            <div key={a.artist}>
              <Link href={`/feed/lastfm/artist/${a.artist}`}>{a.artist}</Link> - {a.sum} listens
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'LastFM',
  description: 'My recent LastFM activity',
};
