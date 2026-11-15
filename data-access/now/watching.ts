import 'server-only';

import { sql } from 'drizzle-orm';
import { db } from 'drizzle/db';
import { tableExists } from 'data-access/feed/sources/tableExists';
import type { Watch, Watching } from './now.types';

type Row = Record<string, unknown>;
const num = (v: unknown) => Number(v ?? 0);

const episodeCode = (season: unknown, number: unknown) =>
  season == null || number == null ? null : `S${num(season)}E${num(number)}`;

const toWatch = (r: Row): Watch => ({
  type: r.type === 'movie' ? 'movie' : 'episode',
  title: String(r.title),
  showTitle: r.show_title == null ? null : String(r.show_title),
  episode: r.type === 'movie' ? null : episodeCode(r.season, r.number),
  watchedAt: new Date(String(r.watched_at)).toISOString(),
});

/** What I've been watching, from pulsar's copy of my Trakt history. Null until the table exists. */
export async function getWatching(): Promise<Watching | null> {
  if (!(await tableExists('trakt_history'))) return null;

  const [last, shows, movies, totals] = await Promise.all([
    db.execute(sql`
      SELECT type, title, show_title, season, number, watched_at
      FROM trakt_history ORDER BY watched_at DESC LIMIT 1`),

    db.execute(sql`
      WITH recent AS (
        SELECT show_title, season, number, watched_at,
               ROW_NUMBER() OVER (PARTITION BY show_title ORDER BY watched_at DESC) AS rn,
               COUNT(*) OVER (PARTITION BY show_title) AS episodes
        FROM trakt_history
        WHERE type = 'episode' AND show_title IS NOT NULL AND watched_at > now() - interval '30 days'
      )
      SELECT show_title, season, number, watched_at, episodes
      FROM recent WHERE rn = 1 ORDER BY watched_at DESC LIMIT 5`),

    db.execute(sql`
      SELECT type, title, show_title, season, number, watched_at
      FROM trakt_history WHERE type = 'movie' ORDER BY watched_at DESC LIMIT 4`),

    db.execute(sql`
      SELECT COUNT(*) FILTER (WHERE type = 'episode' AND watched_at > now() - interval '30 days') AS ep30,
             COUNT(*) FILTER (WHERE type = 'movie' AND watched_at > now() - interval '30 days') AS mv30,
             COUNT(*) FILTER (WHERE type = 'episode'
               AND watched_at >= date_trunc('year', now() AT TIME ZONE 'America/New_York') AT TIME ZONE 'America/New_York') AS epyr,
             COUNT(*) FILTER (WHERE type = 'movie'
               AND watched_at >= date_trunc('year', now() AT TIME ZONE 'America/New_York') AT TIME ZONE 'America/New_York') AS mvyr
      FROM trakt_history`),
  ]);

  const lastRow = (last.rows as Row[])[0];
  if (!lastRow) return null;
  const t = ((totals.rows as Row[])[0] ?? {}) as Row;

  return {
    last: toWatch(lastRow),
    shows: (shows.rows as Row[]).map((r) => ({
      title: String(r.show_title),
      episodes: num(r.episodes),
      lastWatched: new Date(String(r.watched_at)).toISOString(),
      latest: episodeCode(r.season, r.number),
    })),
    recentMovies: (movies.rows as Row[]).map(toWatch),
    last30: { episodes: num(t.ep30), movies: num(t.mv30) },
    thisYear: { episodes: num(t.epyr), movies: num(t.mvyr) },
  };
}
