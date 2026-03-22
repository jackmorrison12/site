import 'server-only';

import { count, desc, eq, gte, and, lt, sql } from 'drizzle-orm';
import { db } from 'drizzle/db';
import { listens, tracks } from 'drizzle/schema';
import type {
  DateRange,
  SummaryStats,
  TrackWithCount,
  ArtistWithCount,
  MonthlyTopArtist,
  WeeklyObsession,
  ListeningPatterns,
  ArtistTrend,
} from './data.types';

const MONTH_NAMES = [
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

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function dateFilter(range: DateRange) {
  return and(gte(listens.time, range.startDate), lt(listens.time, range.endDate));
}

export async function getSummaryStats(range: DateRange): Promise<SummaryStats> {
  const result = await db
    .select({
      totalListens: count(listens.id),
      uniqueTracks: sql<number>`COUNT(DISTINCT ${listens.id})`,
      uniqueArtists: sql<number>`COUNT(DISTINCT ${tracks.artist})`,
    })
    .from(listens)
    .innerJoin(tracks, eq(listens.id, tracks.id))
    .where(dateFilter(range));

  return {
    totalListens: result[0]?.totalListens ?? 0,
    uniqueTracks: Number(result[0]?.uniqueTracks ?? 0),
    uniqueArtists: Number(result[0]?.uniqueArtists ?? 0),
  };
}

export async function getTopTracks(range: DateRange, limit = 10): Promise<TrackWithCount[]> {
  const result = await db
    .select({
      name: tracks.name,
      artist: tracks.artist,
      count: count(listens.id),
      id: tracks.id,
      imageUrl: tracks.imageUrl,
    })
    .from(listens)
    .innerJoin(tracks, eq(listens.id, tracks.id))
    .where(dateFilter(range))
    .groupBy(listens.id, tracks.name, tracks.artist, tracks.id, tracks.imageUrl)
    .orderBy(desc(count(listens.id)))
    .limit(limit);

  return result;
}

export async function getTopArtists(range: DateRange, limit = 10): Promise<ArtistWithCount[]> {
  const result = await db.execute(sql`
    WITH artist_counts AS (
      SELECT ${tracks.artist} AS artist, COUNT(*) AS listen_count
      FROM ${listens}
      INNER JOIN ${tracks} ON ${listens.id} = ${tracks.id}
      WHERE ${listens.time} >= ${range.startDate} AND ${listens.time} < ${range.endDate}
      GROUP BY ${tracks.artist}
      ORDER BY listen_count DESC
      LIMIT ${limit}
    ),
    artist_top_tracks AS (
      SELECT
        ${tracks.artist} AS artist,
        ${tracks.name} AS track_name,
        ${tracks.imageUrl} AS image_url,
        ROW_NUMBER() OVER (PARTITION BY ${tracks.artist} ORDER BY COUNT(*) DESC) AS rn
      FROM ${listens}
      INNER JOIN ${tracks} ON ${listens.id} = ${tracks.id}
      WHERE ${listens.time} >= ${range.startDate} AND ${listens.time} < ${range.endDate}
        AND ${tracks.artist} IN (SELECT artist FROM artist_counts)
      GROUP BY ${tracks.artist}, ${tracks.name}, ${tracks.imageUrl}
    )
    SELECT ac.artist, ac.listen_count, att.track_name, att.image_url
    FROM artist_counts ac
    LEFT JOIN artist_top_tracks att ON ac.artist = att.artist AND att.rn = 1
    ORDER BY ac.listen_count DESC
  `);

  return (result.rows as { artist: string; listen_count: string; track_name: string | null; image_url: string | null }[]).map((row) => ({
    artist: row.artist,
    count: Number(row.listen_count),
    imageUrl: row.image_url,
    topTrack: row.track_name,
  }));
}

export async function getTopArtistByMonth(range: DateRange): Promise<MonthlyTopArtist[]> {
  const result = await db.execute(sql`
    WITH monthly_counts AS (
      SELECT
        ${tracks.artist} AS artist,
        EXTRACT(MONTH FROM ${listens.time}) AS month_num,
        COUNT(*) AS listen_count,
        ROW_NUMBER() OVER (
          PARTITION BY EXTRACT(MONTH FROM ${listens.time})
          ORDER BY COUNT(*) DESC
        ) AS rn
      FROM ${listens}
      INNER JOIN ${tracks} ON ${listens.id} = ${tracks.id}
      WHERE ${listens.time} >= ${range.startDate} AND ${listens.time} < ${range.endDate}
      GROUP BY ${tracks.artist}, EXTRACT(MONTH FROM ${listens.time})
    ),
    artist_images AS (
      SELECT DISTINCT ON (t.artist)
        t.artist,
        t.image_url
      FROM ${tracks} t
      WHERE t.image_url IS NOT NULL
      ORDER BY t.artist, t.id
    )
    SELECT mc.artist, mc.month_num, mc.listen_count, ai.image_url
    FROM monthly_counts mc
    LEFT JOIN artist_images ai ON mc.artist = ai.artist
    WHERE mc.rn = 1
    ORDER BY mc.month_num
  `);

  return (result.rows as { artist: string; month_num: string; listen_count: string; image_url: string | null }[]).map((row) => {
    const monthIndex = Number(row.month_num) - 1;
    return {
      month: monthIndex,
      monthName: MONTH_NAMES[monthIndex],
      artist: row.artist,
      count: Number(row.listen_count),
      imageUrl: row.image_url ?? null,
    };
  });
}

export async function getObsessionTracks(range: DateRange, limit = 5): Promise<WeeklyObsession[]> {
  const result = await db
    .select({
      name: tracks.name,
      artist: tracks.artist,
      count: count(listens.id),
      id: tracks.id,
      imageUrl: tracks.imageUrl,
      weekDate: sql<string>`date_trunc('week', ${listens.time}::date)`,
    })
    .from(listens)
    .innerJoin(tracks, eq(listens.id, tracks.id))
    .where(dateFilter(range))
    .groupBy(listens.id, tracks.name, tracks.artist, tracks.id, tracks.imageUrl, sql`date_trunc('week', ${listens.time}::date)`)
    .orderBy(desc(count(listens.id)))
    .limit(limit);

  return result.map((row) => ({
    ...row,
    weekDate: new Date(row.weekDate),
  }));
}

export async function getListeningPatterns(range: DateRange): Promise<ListeningPatterns> {
  const localTime = sql`${listens.time} AT TIME ZONE 'America/New_York'`;
  const [byDayResult, byHourResult] = await Promise.all([
    db
      .select({
        day: sql<number>`EXTRACT(DOW FROM ${localTime})`,
        count: count(listens.id),
      })
      .from(listens)
      .where(dateFilter(range))
      .groupBy(sql`EXTRACT(DOW FROM ${localTime})`)
      .orderBy(sql`EXTRACT(DOW FROM ${localTime})`),
    db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${localTime})`,
        count: count(listens.id),
      })
      .from(listens)
      .where(dateFilter(range))
      .groupBy(sql`EXTRACT(HOUR FROM ${localTime})`)
      .orderBy(sql`EXTRACT(HOUR FROM ${localTime})`),
  ]);

  return {
    byDay: byDayResult.map((row) => ({
      day: Number(row.day),
      dayName: DAY_NAMES[Number(row.day)],
      count: row.count,
    })),
    byHour: byHourResult.map((row) => ({
      hour: Number(row.hour),
      count: row.count,
    })),
  };
}

export async function getNewDiscoveries(range: DateRange, limit = 20): Promise<ArtistWithCount[]> {
  const duration = range.endDate.getTime() - range.startDate.getTime();
  const previousRange: DateRange = {
    startDate: new Date(range.startDate.getTime() - duration),
    endDate: range.startDate,
  };

  const [currentArtists, previousArtists] = await Promise.all([
    db
      .select({ artist: tracks.artist, count: count(listens.id), imageUrl: sql<string | null>`MIN(${tracks.imageUrl})` })
      .from(listens)
      .innerJoin(tracks, eq(listens.id, tracks.id))
      .where(dateFilter(range))
      .groupBy(tracks.artist)
      .orderBy(desc(sql`count`)),
    db
      .select({ artist: tracks.artist })
      .from(listens)
      .innerJoin(tracks, eq(listens.id, tracks.id))
      .where(dateFilter(previousRange))
      .groupBy(tracks.artist),
  ]);

  const previousArtistSet = new Set(previousArtists.map((a) => a.artist));
  return currentArtists.filter((a) => !previousArtistSet.has(a.artist)).slice(0, limit);
}

export async function getArtistTrends(range: DateRange, limit = 15): Promise<ArtistTrend[]> {
  const duration = range.endDate.getTime() - range.startDate.getTime();
  const previousRange: DateRange = {
    startDate: new Date(range.startDate.getTime() - duration),
    endDate: range.startDate,
  };

  const [currentArtists, previousArtists] = await Promise.all([
    db
      .select({ artist: tracks.artist, count: count(listens.id), imageUrl: sql<string | null>`MIN(${tracks.imageUrl})` })
      .from(listens)
      .innerJoin(tracks, eq(listens.id, tracks.id))
      .where(dateFilter(range))
      .groupBy(tracks.artist)
      .orderBy(desc(sql`count`)),
    db
      .select({ artist: tracks.artist, count: count(listens.id) })
      .from(listens)
      .innerJoin(tracks, eq(listens.id, tracks.id))
      .where(dateFilter(previousRange))
      .groupBy(tracks.artist)
      .orderBy(desc(sql`count`)),
  ]);

  const previousMap = new Map(previousArtists.map((a) => [a.artist, a.count]));

  const trends: ArtistTrend[] = currentArtists
    .filter((a) => previousMap.has(a.artist))
    .map((a) => {
      const previousCount = previousMap.get(a.artist)!;
      const percentChange = previousCount > 0 ? ((a.count - previousCount) / previousCount) * 100 : 0;
      return {
        artist: a.artist,
        currentCount: a.count,
        previousCount,
        percentChange,
        imageUrl: a.imageUrl,
      };
    })
    .sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange))
    .slice(0, limit);

  return trends;
}
