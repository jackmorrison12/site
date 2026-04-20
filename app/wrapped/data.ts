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
      uniqueTracks: sql<number>`COUNT(DISTINCT LOWER(${tracks.name}) || '__' || LOWER(${tracks.artist}))`,
      uniqueArtists: sql<number>`COUNT(DISTINCT LOWER(${tracks.artist}))`,
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
      name: sql<string>`MODE() WITHIN GROUP (ORDER BY ${tracks.name})`,
      artist: sql<string>`MODE() WITHIN GROUP (ORDER BY ${tracks.artist})`,
      count: count(listens.id),
      id: sql<string>`MIN(${tracks.id})`,
      imageUrl: sql<string | null>`MODE() WITHIN GROUP (ORDER BY ${tracks.imageUrl})`,
    })
    .from(listens)
    .innerJoin(tracks, eq(listens.id, tracks.id))
    .where(dateFilter(range))
    .groupBy(sql`LOWER(${tracks.name})`, sql`LOWER(${tracks.artist})`)
    .orderBy(desc(count(listens.id)))
    .limit(limit);

  return result;
}

export async function getTopArtists(range: DateRange, limit = 10): Promise<ArtistWithCount[]> {
  const result = await db.execute(sql`
    WITH artist_counts AS (
      SELECT
        LOWER(${tracks.artist}) AS artist_key,
        MODE() WITHIN GROUP (ORDER BY ${tracks.artist}) AS artist,
        COUNT(*) AS listen_count
      FROM ${listens}
      INNER JOIN ${tracks} ON ${listens.id} = ${tracks.id}
      WHERE ${listens.time} >= ${range.startDate} AND ${listens.time} < ${range.endDate}
      GROUP BY LOWER(${tracks.artist})
      ORDER BY listen_count DESC
      LIMIT ${limit}
    ),
    artist_top_tracks AS (
      SELECT
        LOWER(${tracks.artist}) AS artist_key,
        MODE() WITHIN GROUP (ORDER BY ${tracks.name}) AS track_name,
        MODE() WITHIN GROUP (ORDER BY ${tracks.imageUrl}) AS image_url,
        COUNT(*) AS track_count,
        ROW_NUMBER() OVER (PARTITION BY LOWER(${tracks.artist}) ORDER BY COUNT(*) DESC) AS rn
      FROM ${listens}
      INNER JOIN ${tracks} ON ${listens.id} = ${tracks.id}
      WHERE ${listens.time} >= ${range.startDate} AND ${listens.time} < ${range.endDate}
        AND LOWER(${tracks.artist}) IN (SELECT artist_key FROM artist_counts)
      GROUP BY LOWER(${tracks.artist}), LOWER(${tracks.name})
    )
    SELECT ac.artist, ac.listen_count, att.track_name, att.image_url
    FROM artist_counts ac
    LEFT JOIN artist_top_tracks att ON ac.artist_key = att.artist_key AND att.rn = 1
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
        LOWER(${tracks.artist}) AS artist_key,
        MODE() WITHIN GROUP (ORDER BY ${tracks.artist}) AS artist,
        EXTRACT(MONTH FROM ${listens.time}) AS month_num,
        COUNT(*) AS listen_count,
        ROW_NUMBER() OVER (
          PARTITION BY EXTRACT(MONTH FROM ${listens.time})
          ORDER BY COUNT(*) DESC
        ) AS rn
      FROM ${listens}
      INNER JOIN ${tracks} ON ${listens.id} = ${tracks.id}
      WHERE ${listens.time} >= ${range.startDate} AND ${listens.time} < ${range.endDate}
      GROUP BY LOWER(${tracks.artist}), EXTRACT(MONTH FROM ${listens.time})
    ),
    artist_images AS (
      SELECT DISTINCT ON (LOWER(t.artist))
        LOWER(t.artist) AS artist_key,
        t.image_url
      FROM ${tracks} t
      WHERE t.image_url IS NOT NULL
      ORDER BY LOWER(t.artist), t.id
    )
    SELECT mc.artist, mc.month_num, mc.listen_count, ai.image_url
    FROM monthly_counts mc
    LEFT JOIN artist_images ai ON mc.artist_key = ai.artist_key
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
      name: sql<string>`MODE() WITHIN GROUP (ORDER BY ${tracks.name})`,
      artist: sql<string>`MODE() WITHIN GROUP (ORDER BY ${tracks.artist})`,
      count: count(listens.id),
      id: sql<string>`MIN(${tracks.id})`,
      imageUrl: sql<string | null>`MODE() WITHIN GROUP (ORDER BY ${tracks.imageUrl})`,
      weekDate: sql<string>`date_trunc('week', ${listens.time}::date)`,
    })
    .from(listens)
    .innerJoin(tracks, eq(listens.id, tracks.id))
    .where(dateFilter(range))
    .groupBy(sql`LOWER(${tracks.name})`, sql`LOWER(${tracks.artist})`, sql`date_trunc('week', ${listens.time}::date)`)
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
  const [currentArtists, previousArtists] = await Promise.all([
    db
      .select({
        artist: sql<string>`MODE() WITHIN GROUP (ORDER BY ${tracks.artist})`,
        count: count(listens.id),
        imageUrl: sql<string | null>`MODE() WITHIN GROUP (ORDER BY ${tracks.imageUrl})`,
      })
      .from(listens)
      .innerJoin(tracks, eq(listens.id, tracks.id))
      .where(dateFilter(range))
      .groupBy(sql`LOWER(${tracks.artist})`)
      .orderBy(desc(sql`count`)),
    db
      .select({ artist: sql<string>`MODE() WITHIN GROUP (ORDER BY ${tracks.artist})` })
      .from(listens)
      .innerJoin(tracks, eq(listens.id, tracks.id))
      .where(lt(listens.time, range.startDate))
      .groupBy(sql`LOWER(${tracks.artist})`),
  ]);

  const previousArtistSet = new Set(previousArtists.map((a) => a.artist.toLowerCase()));
  return currentArtists.filter((a) => !previousArtistSet.has(a.artist.toLowerCase())).slice(0, limit);
}

export async function getArtistTrends(range: DateRange, limit = 15): Promise<ArtistTrend[]> {
  const duration = range.endDate.getTime() - range.startDate.getTime();
  const previousRange: DateRange = {
    startDate: new Date(range.startDate.getTime() - duration),
    endDate: range.startDate,
  };

  const [currentArtists, previousArtists] = await Promise.all([
    db
      .select({
        artist: sql<string>`MODE() WITHIN GROUP (ORDER BY ${tracks.artist})`,
        count: count(listens.id),
        imageUrl: sql<string | null>`MODE() WITHIN GROUP (ORDER BY ${tracks.imageUrl})`,
      })
      .from(listens)
      .innerJoin(tracks, eq(listens.id, tracks.id))
      .where(dateFilter(range))
      .groupBy(sql`LOWER(${tracks.artist})`)
      .orderBy(desc(sql`count`)),
    db
      .select({
        artist: sql<string>`MODE() WITHIN GROUP (ORDER BY ${tracks.artist})`,
        count: count(listens.id),
      })
      .from(listens)
      .innerJoin(tracks, eq(listens.id, tracks.id))
      .where(dateFilter(previousRange))
      .groupBy(sql`LOWER(${tracks.artist})`)
      .orderBy(desc(sql`count`)),
  ]);

  const previousMap = new Map(previousArtists.map((a) => [a.artist.toLowerCase(), a.count]));

  const trends: ArtistTrend[] = currentArtists
    .filter((a) => (previousMap.get(a.artist.toLowerCase()) ?? 0) >= 5)
    .map((a) => {
      const previousCount = previousMap.get(a.artist.toLowerCase())!;
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

export async function getLastSyncTime(): Promise<Date | null> {
  const row = (await db.select({ time: listens.time }).from(listens).orderBy(desc(listens.time)).limit(1))[0];
  return row?.time ?? null;
}
