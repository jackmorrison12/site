import 'server-only';

import { sql } from 'drizzle-orm';
import { db } from 'drizzle/db';
import type { MusicMonth } from '../feed.types';

/**
 * I moved London -> New York at the start of 2024, so months are bucketed in
 * whichever zone I was living in. Keep this in step with `reportTzForDate`.
 */
const localTime = (col: string) =>
  sql.raw(`(${col} AT TIME ZONE CASE WHEN ${col} < TIMESTAMPTZ '2024-01-01 00:00:00+00'
    THEN 'Europe/London' ELSE 'America/New_York' END)`);

const MONTH_OF = (col: string) => sql`date_trunc('month', ${localTime(col)})`;

type Row = Record<string, unknown>;
const num = (v: unknown) => Number(v ?? 0);
const str = (v: unknown) => (v == null ? null : String(v));

/**
 * Every month of listening history in one pass per statistic. Computing all ~94
 * months costs about as much as computing one, so the feed never paginates queries.
 */
export async function getMusicMonths(): Promise<Map<string, MusicMonth>> {
  const [headline, top, discovery, perDay, peak, obsession] = await Promise.all([
    db.execute(sql`
      SELECT to_char(${MONTH_OF('l.time')}, 'YYYY-MM') AS mon,
             COUNT(*) AS listens,
             COUNT(DISTINCT LOWER(t.artist)) AS artists,
             COUNT(DISTINCT (LOWER(t.name), LOWER(t.artist))) AS tracks
      FROM listens l JOIN tracks t ON l.id = t.id
      GROUP BY 1`),

    db.execute(sql`
      WITH m AS (
        SELECT ${MONTH_OF('l.time')} AS mon,
               LOWER(t.artist) AS akey,
               MODE() WITHIN GROUP (ORDER BY t.artist) AS artist,
               MODE() WITHIN GROUP (ORDER BY t.image_url) AS img,
               COUNT(*) AS n,
               ROW_NUMBER() OVER (PARTITION BY ${MONTH_OF('l.time')} ORDER BY COUNT(*) DESC) AS rn
        FROM listens l JOIN tracks t ON l.id = t.id
        GROUP BY 1, 2
      )
      SELECT to_char(mon,'YYYY-MM') AS mon, artist, n, img FROM m WHERE rn = 1`),

    // "First time I ever heard this artist" — one MIN() over all history beats
    // re-scanning the past for every month.
    db.execute(sql`
      WITH f AS (
        SELECT LOWER(t.artist) AS akey,
               MODE() WITHIN GROUP (ORDER BY t.artist) AS artist,
               MIN(l.time) AS first_time
        FROM listens l JOIN tracks t ON l.id = t.id
        GROUP BY 1
      )
      SELECT to_char(${MONTH_OF('first_time')}, 'YYYY-MM') AS mon,
             COUNT(*) AS n,
             (array_agg(artist ORDER BY artist))[1:3] AS names
      FROM f GROUP BY 1`),

    db.execute(sql`
      SELECT to_char(${MONTH_OF('l.time')}, 'YYYY-MM') AS mon,
             EXTRACT(DAY FROM ${localTime('l.time')}) AS d,
             COUNT(*) AS n
      FROM listens l GROUP BY 1, 2`),

    db.execute(sql`
      WITH h AS (
        SELECT ${MONTH_OF('l.time')} AS mon,
               EXTRACT(HOUR FROM ${localTime('l.time')}) AS hr,
               COUNT(*) AS n,
               ROW_NUMBER() OVER (PARTITION BY ${MONTH_OF('l.time')} ORDER BY COUNT(*) DESC) AS rn
        FROM listens l GROUP BY 1, 2
      )
      SELECT to_char(mon,'YYYY-MM') AS mon, hr, n FROM h WHERE rn = 1`),

    db.execute(sql`
      WITH w AS (
        SELECT ${MONTH_OF('l.time')} AS mon,
               LOWER(t.name) AS nk, LOWER(t.artist) AS ak,
               MODE() WITHIN GROUP (ORDER BY t.name) AS nm,
               MODE() WITHIN GROUP (ORDER BY t.artist) AS ar,
               MODE() WITHIN GROUP (ORDER BY t.image_url) AS img,
               COUNT(*) AS n,
               ROW_NUMBER() OVER (PARTITION BY ${MONTH_OF('l.time')} ORDER BY COUNT(*) DESC) AS rn
        FROM listens l JOIN tracks t ON l.id = t.id
        GROUP BY 1, 2, 3
      )
      SELECT to_char(mon,'YYYY-MM') AS mon, nm, ar, img, n FROM w WHERE rn = 1`),
  ]);

  const months = new Map<string, MusicMonth>();
  const ensure = (key: string): MusicMonth => {
    let m = months.get(key);
    if (!m) {
      m = { listens: 0, artists: 0, tracks: 0, discoveries: 0, discoveryNames: [], perDay: [], isRecord: false };
      months.set(key, m);
    }
    return m;
  };

  for (const r of headline.rows as Row[]) {
    const m = ensure(String(r.mon));
    m.listens = num(r.listens);
    m.artists = num(r.artists);
    m.tracks = num(r.tracks);
  }

  for (const r of top.rows as Row[]) {
    const artist = str(r.artist);
    if (artist) ensure(String(r.mon)).topArtist = { name: artist, count: num(r.n), imageUrl: str(r.img) };
  }

  for (const r of discovery.rows as Row[]) {
    const m = ensure(String(r.mon));
    m.discoveries = num(r.n);
    m.discoveryNames = Array.isArray(r.names) ? (r.names as string[]).filter(Boolean) : [];
  }

  for (const r of perDay.rows as Row[]) {
    const m = ensure(String(r.mon));
    m.perDay[num(r.d) - 1] = num(r.n);
  }

  for (const r of peak.rows as Row[]) {
    ensure(String(r.mon)).peakHour = { hour: num(r.hr), count: num(r.n) };
  }

  for (const r of obsession.rows as Row[]) {
    const track = str(r.nm);
    const artist = str(r.ar);
    if (track && artist) {
      ensure(String(r.mon)).obsession = { track, artist, count: num(r.n), imageUrl: str(r.img) };
    }
  }

  // Fill sparkline gaps, derive the busiest day, and badge the all-time record.
  let record = 0;
  let recordKey: string | null = null;
  for (const [key, m] of months) {
    const days = new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)), 0).getDate();
    for (let i = 0; i < days; i += 1) m.perDay[i] = m.perDay[i] ?? 0;
    m.perDay.length = days;

    const best = m.perDay.reduce((acc, n, i) => (n > m.perDay[acc] ? i : acc), 0);
    if (m.perDay[best] > 0) m.busiestDay = { day: best + 1, count: m.perDay[best] };

    if (m.listens > record) {
      record = m.listens;
      recordKey = key;
    }
  }
  if (recordKey) months.get(recordKey)!.isRecord = true;

  return months;
}
