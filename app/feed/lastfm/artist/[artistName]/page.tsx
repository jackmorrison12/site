import { count, eq, gte, desc, and, SQL, sql } from 'drizzle-orm';
import { db } from 'drizzle/db';
import { listens, tracks } from 'drizzle/schema';
import Image from 'next/image';

import styles from './lastfmArtist.module.scss';
import { AnyPgColumn } from 'drizzle-orm/pg-core';

function lower(col: AnyPgColumn): SQL {
  return sql`lower(${col})`;
}

export default async function Page(props: { params: Promise<{ artistName: string }> }) {
  const params = await props.params;
  const artistName = decodeURIComponent(params.artistName);

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
    .where(and(gte(listens.time, new Date(2024, 0, 1)), eq(lower(tracks.artist), artistName.toLowerCase())))
    .groupBy(listens.id, tracks.name, tracks.artist, tracks.id, tracks.imageUrl)
    .orderBy(desc(count(listens.id)))
    .limit(100);

  if (topTracks.length === 0) {
    return <div>No tracks found for {artistName}</div>;
  }

  return (
    <div>
      <h1>Top songs by {artistName}</h1>
      {topTracks.map((t, i) => (
        <div key={t.id} className={styles.trackWrapper}>
          {i + 1}
          {t.imageUrl && <Image src={t.imageUrl} width={50} height={50} alt={`Cover art for ${t.name}`} />}
          {t.name} - {t.artist} - {t.count} listens
        </div>
      ))}
    </div>
  );
}
