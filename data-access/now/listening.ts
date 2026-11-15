import 'server-only';

import { getSummaryStats, getTopArtists, getTopTracks } from 'app/wrapped/data';
import type { Listening } from './now.types';

const DAY_MS = 24 * 60 * 60 * 1000;

/** The last 30 days of scrobbles, from the listens Pulsar syncs. Null when there are none. */
export async function getListening(now = new Date()): Promise<Listening | null> {
  const range = { startDate: new Date(now.getTime() - 30 * DAY_MS), endDate: now };
  const [summary, artists, tracks] = await Promise.all([
    getSummaryStats(range),
    getTopArtists(range, 5),
    getTopTracks(range, 5),
  ]);
  if (!summary.totalListens) return null;

  return {
    last30: { listens: summary.totalListens, artists: summary.uniqueArtists, tracks: summary.uniqueTracks },
    topArtists: artists.map((a) => ({ artist: a.artist, count: a.count, imageUrl: a.imageUrl ?? null })),
    topTracks: tracks.map((t) => ({ name: t.name, artist: t.artist, count: t.count, imageUrl: t.imageUrl })),
  };
}
