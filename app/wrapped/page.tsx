import { Title } from 'components/shared/Title';
import { count, desc, eq, gte, and, lte, sql, sum } from 'drizzle-orm';
import { db } from 'drizzle/db';
import { listens, tracks } from 'drizzle/schema';
import Image from 'next/image';

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

  // Top Tracks

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

  // Top Artists

  const topArtists = await db
    .select({ artist: tracks.artist, count: count(listens.id) })
    .from(listens)
    .innerJoin(tracks, eq(listens.id, tracks.id))
    .where(and(gte(listens.time, new Date(year, 0, 1)), lte(listens.time, new Date(year + 1, 0, 1))))
    .groupBy(tracks.artist)
    .orderBy(desc(sql`count`))
    .limit(5);

  // Most listened to tracks in a week

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

  // Most listened to artist per month

  const topArtistByMonth = await Promise.all(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
      async (n) =>
        await db
          .select({
            artist: tracks.artist,
            count: count(listens.id),
            month: sql<number>`date_trunc('month', listens.time::date)`,
          })
          .from(listens)
          .innerJoin(tracks, eq(listens.id, tracks.id))
          .where(
            and(
              gte(listens.time, new Date(year, n, 1)),
              lte(listens.time, new Date(n === 11 ? year + 1 : year, n === 11 ? 0 : n + 1, 1)),
            ),
          )
          .groupBy(tracks.artist, sql`date_trunc('month', listens.time::date)`)
          .orderBy(desc(sql`count`))
          .limit(1),
    ),
  );

  // Artist diff

  const topArtistsCurr = await db
    .select({ artist: tracks.artist, count: count(listens.id) })
    .from(listens)
    .innerJoin(tracks, eq(listens.id, tracks.id))
    .where(and(gte(listens.time, new Date(year, 0, 1)), lte(listens.time, new Date(year + 1, 0, 1))))
    .groupBy(tracks.artist)
    .orderBy(desc(sql`count`));

  const topArtistsPrev = await db
    .select({ artist: tracks.artist, count: count(listens.id) })
    .from(listens)
    .innerJoin(tracks, eq(listens.id, tracks.id))
    .where(and(gte(listens.time, new Date(year - 1, 0, 1)), lte(listens.time, new Date(year, 0, 1))))
    .groupBy(tracks.artist)
    .orderBy(desc(sql`count`));

  const topArtistsCurrSet = new Set(topArtistsCurr.map((a) => a.artist));
  const topArtistsPrevSet = new Set(topArtistsPrev.map((a) => a.artist));

  const newArtists = topArtistsCurrSet.difference(topArtistsPrevSet);

  const artistMap = Object.fromEntries(topArtistsCurr.map((x) => [x.artist, x.count]));

  console.log(artistMap['Sabrina Carpenter']);

  // console.log(artistMap);
  topArtistsPrev.forEach((a) => {
    // console.log(a.artist in artistMap);
    // console.log(a.artist);
    // console.log(a.count);
    if (a.artist in artistMap) {
      if (a.artist === 'Sabrina Carpenter') {
        console.log(a.count);
      }
      artistMap[a.artist] = ((artistMap[a.artist] - a.count) / artistMap[a.artist]) * 100;
    }
  });

  newArtists.forEach((a) => {
    delete artistMap[a];
  });

  // Need to handle the case where artists weren't listened to in prev year

  // console.log(Object.entries(artistMap).sort(([, a], [, b]) => b - a));

  return (
    <>
      <Title value="WRAPPED" offset="-311.71" />
      <h2>Most listened to songs of {year}</h2>
      {topTracks.map((t, i) => (
        <div key={t.id} style={{ display: 'flex' }}>
          {t.imageUrl && <Image src={t.imageUrl} width={50} height={50} alt={`Cover art for ${t.name}`} />}
          {i + 1}: {t.name} ({t.count} listens)
        </div>
      ))}

      <h2>Most listened to artists of {year}</h2>
      {topArtists.map((t, i) => (
        <div key={t.artist} style={{ display: 'flex' }}>
          {i + 1}: {t.artist} ({t.count} listens)
        </div>
      ))}

      <h2>Some tracks I listened to a lot...</h2>
      {topWeekTracks.map((t) => (
        <div key={t.id}>
          In the {getNumberWithOrdinal(Math.ceil((new Date(t.date).getUTCDate() - 1) / 7) + 1)} Week of{' '}
          {MONTHS[new Date(t.date).getUTCMonth()]} I listened to {t.name} by {t.artist} {t.count} times!
        </div>
      ))}

      <h2>Most listened to artist of each month:</h2>
      {topArtistByMonth.map((a) => (
        <div key={a[0]?.month}>
          {a[0]?.artist} - {a[0]?.count} - {new Date(a[0]?.month).toString()}
        </div>
      ))}
    </>
  );
}

export const metadata = {
  title: 'Wrapped',
  description: 'My wrapped',
};