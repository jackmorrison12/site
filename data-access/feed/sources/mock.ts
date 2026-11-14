import type { TraktMonth } from '../feed.types';
import type { ContributionDay } from './github';

/**
 * Stand-in data for the sources pulsar hasn't mirrored into Postgres yet, so the
 * GitHub and Trakt tiles can be designed against something that looks real.
 *
 * Off unless FEED_MOCK_SOURCES=1, and only ever used when the real table is
 * absent — the moment pulsar creates it, real data wins. This never writes to the
 * database, so there is no way for invented numbers to reach production.
 */
export const mocksEnabled = () => process.env.FEED_MOCK_SOURCES === '1';

/** Deterministic per-day noise, so numbers don't churn between renders. */
const hash = (n: number): number => {
  let t = (n + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const monthKey = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

function eachDay(from: Date, cb: (date: Date, index: number) => void) {
  const cursor = new Date(from);
  const today = new Date();
  let i = 0;
  while (cursor <= today) {
    cb(new Date(cursor), i);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    i += 1;
  }
}

/** GitHub's own quartile buckets. */
const levelFor = (count: number) => (count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4);

const REPOS = ['jackmorrison12/site', 'jackmorrison12/pulsar', 'jackmorrison12/wrapped', 'jackmorrison12/dotfiles'];

/** Raw daily rows, shaped exactly like the ones the real table yields. */
export function mockGithubDays(): ContributionDay[] {
  const days: ContributionDay[] = [];

  eachDay(new Date(Date.UTC(2019, 0, 1)), (date, i) => {
    const weekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    // A slow wave so some months are visibly busier than others.
    const wave = 0.62 + 0.38 * Math.sin(i / 47);
    const active = hash(i * 7 + 1) < (weekend ? 0.34 : 0.83) * wave;
    const count = active ? 1 + Math.floor(hash(i * 7 + 2) * (weekend ? 5 : 12)) : 0;

    days.push({ month: monthKey(date), day: date.getUTCDate(), count, level: levelFor(count) });
  });

  return days;
}

/** `github_events` only covers a rolling ~90 days, so only recent months get repos. */
export function attachMockRepos(months: Map<string, { topRepo?: { name: string; count: number }; repos?: number }>) {
  [...months.keys()]
    .sort()
    .slice(-3)
    .forEach((key, i) => {
      const m = months.get(key);
      if (!m) return;
      m.topRepo = { name: REPOS[i % REPOS.length], count: 20 + Math.floor(hash(i * 31) * 60) };
      m.repos = 2 + Math.floor(hash(i * 37) * 4);
    });
}

const SHOWS = [
  'Severance',
  'The Bear',
  'Slow Horses',
  'Taskmaster',
  'The Good Wife',
  'Only Murders in the Building',
  'Andor',
];

export function mockTraktMonths(): Map<string, TraktMonth> {
  type Bucket = { episodes: number; movies: number; shows: Map<string, number>; binge?: { title: string; count: number } };
  const buckets = new Map<string, Bucket>();

  // Matches the real history, which starts in November 2023.
  eachDay(new Date(Date.UTC(2023, 10, 1)), (date, i) => {
    const key = monthKey(date);
    let b = buckets.get(key);
    if (!b) {
      b = { episodes: 0, movies: 0, shows: new Map() };
      buckets.set(key, b);
    }

    if (hash(i * 13 + 3) < 0.44) {
      const title = SHOWS[Math.floor(hash(i * 13 + 6) * SHOWS.length)];
      const isBinge = hash(i * 13 + 4) > 0.93;
      const episodes = isBinge ? 4 + Math.floor(hash(i * 13 + 5) * 5) : 1 + Math.floor(hash(i * 13 + 8) * 2);

      b.episodes += episodes;
      b.shows.set(title, (b.shows.get(title) ?? 0) + episodes);
      if (episodes >= 3 && episodes > (b.binge?.count ?? 0)) b.binge = { title, count: episodes };
    }

    if (hash(i * 13 + 7) < 0.07) b.movies += 1;
  });

  const months = new Map<string, TraktMonth>();
  for (const [key, b] of buckets) {
    if (b.episodes === 0 && b.movies === 0) continue;
    const ranked = [...b.shows.entries()].sort((a, z) => z[1] - a[1]);
    months.set(key, {
      episodes: b.episodes,
      movies: b.movies,
      shows: b.shows.size,
      topShow: ranked[0] ? { title: ranked[0][0], count: ranked[0][1] } : undefined,
      biggestBinge: b.binge,
    });
  }

  return months;
}
