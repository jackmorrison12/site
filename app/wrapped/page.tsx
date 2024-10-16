import { Title } from 'components/shared/Title';
import { count, desc, eq, gte, and, lte, sql } from 'drizzle-orm';
import { db } from 'drizzle/db';
import { listens, tracks } from 'drizzle/schema';

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

function getNumberWithOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default async function Page() {
  const year = 2024;

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
    .where(and(gte(listens.time, new Date(year, 0, 1)), lte(listens.time, new Date(year + 1, 0, 1))))
    .groupBy(listens.id, tracks.name, tracks.artist, tracks.id, tracks.imageUrl)
    .orderBy(desc(count(listens.id)))
    .limit(5);

  const topWeekTracks = await db
    .select({
      name: tracks.name,
      artist: tracks.artist,
      count: count(listens.id),
      id: tracks.id,
      imageUrl: tracks.imageUrl,
      date: sql<number>`date_trunc('week', listens.time::date)`,
    })
    .from(listens)
    .innerJoin(tracks, eq(listens.id, tracks.id))
    .where(and(gte(listens.time, new Date(year, 0, 1)), lte(listens.time, new Date(year + 1, 0, 1))))
    .groupBy(
      listens.id,
      tracks.name,
      tracks.artist,
      tracks.id,
      tracks.imageUrl,
      sql`date_trunc('week', listens.time::date)`,
    )
    .orderBy(desc(count(listens.id)))
    .limit(5);

  return (
    <>
      <Title value="WRAPPED" offset="-311.71" />
      <h2>Most listened to songs of {year}</h2>
      {topTracks.map((t, i) => (
        <div key={t.id}>
          {i + 1}: {t.name} ({t.count} listens)
        </div>
      ))}

      <h2>Some tracks I listened to a lot...</h2>
      {topWeekTracks.map((t) => (
        <div key={t.id}>
          In the {getNumberWithOrdinal(Math.ceil((new Date(t.date).getUTCDate() - 1) / 7) + 1)} Week of{' '}
          {MONTHS[new Date(t.date).getUTCMonth()]} I listened to {t.name} by {t.artist} {t.count} times!
        </div>
      ))}
    </>
  );
}

export const metadata = {
  title: 'Wrapped',
  description: 'My wrapped',
};
