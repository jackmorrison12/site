import 'server-only';

import { sql } from 'drizzle-orm';
import { db } from 'drizzle/db';
import type { TraktMonth } from '../feed.types';
import { tableExists } from './tableExists';
import { mockTraktMonths, mocksEnabled } from './mock';

type Row = Record<string, unknown>;
const num = (v: unknown) => Number(v ?? 0);

/**
 * Trakt watch history, once pulsar mirrors it out of local SQLite into Postgres.
 * There is no artwork or rating in the Trakt data, so tiles here are numbers only.
 *
 * Returns an empty map until pulsar creates the table.
 */
export async function getTraktMonths(): Promise<Map<string, TraktMonth>> {
  const months = new Map<string, TraktMonth>();
  if (!(await tableExists('trakt_history'))) {
    return mocksEnabled() ? mockTraktMonths() : months;
  }

  const localMonth = sql.raw(`date_trunc('month', (watched_at AT TIME ZONE
    CASE WHEN watched_at < TIMESTAMPTZ '2024-01-01 00:00:00+00'
    THEN 'Europe/London' ELSE 'America/New_York' END))`);

  const [totals, top, binge] = await Promise.all([
    db.execute(sql`
      SELECT to_char(${localMonth}, 'YYYY-MM') AS mon,
             COUNT(*) FILTER (WHERE type = 'episode') AS episodes,
             COUNT(*) FILTER (WHERE type = 'movie') AS movies,
             COUNT(DISTINCT show_title) FILTER (WHERE show_title IS NOT NULL) AS shows
      FROM trakt_history GROUP BY 1`),

    db.execute(sql`
      WITH s AS (
        SELECT ${localMonth} AS mon, show_title, COUNT(*) AS n,
               ROW_NUMBER() OVER (PARTITION BY ${localMonth} ORDER BY COUNT(*) DESC) AS rn
        FROM trakt_history WHERE show_title IS NOT NULL GROUP BY 1, 2
      )
      SELECT to_char(mon,'YYYY-MM') AS mon, show_title, n FROM s WHERE rn = 1`),

    // Most episodes of one show polished off in a single day.
    db.execute(sql`
      WITH d AS (
        SELECT ${localMonth} AS mon, date_trunc('day', watched_at) AS day, show_title, COUNT(*) AS n
        FROM trakt_history WHERE show_title IS NOT NULL GROUP BY 1, 2, 3
      ), r AS (
        SELECT mon, show_title, n, ROW_NUMBER() OVER (PARTITION BY mon ORDER BY n DESC) AS rn FROM d
      )
      SELECT to_char(mon,'YYYY-MM') AS mon, show_title, n FROM r WHERE rn = 1`),
  ]);

  const ensure = (key: string): TraktMonth => {
    let m = months.get(key);
    if (!m) {
      m = { episodes: 0, movies: 0, shows: 0 };
      months.set(key, m);
    }
    return m;
  };

  for (const r of totals.rows as Row[]) {
    const m = ensure(String(r.mon));
    m.episodes = num(r.episodes);
    m.movies = num(r.movies);
    m.shows = num(r.shows);
  }
  for (const r of top.rows as Row[]) {
    ensure(String(r.mon)).topShow = { title: String(r.show_title), count: num(r.n) };
  }
  for (const r of binge.rows as Row[]) {
    if (num(r.n) >= 3) ensure(String(r.mon)).biggestBinge = { title: String(r.show_title), count: num(r.n) };
  }

  return months;
}
