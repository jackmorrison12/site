import 'server-only';

import { unstable_cache } from 'next/cache';
import { asc } from 'drizzle-orm';
import { db } from 'drizzle/db';
import { listens } from 'drizzle/schema';
import { reportTzForDate } from 'utils/reportTz';
import type { MonthSummary, FeedPage, MonthKey } from './feed.types';
import { getMusicMonths } from './sources/music';
import { getGithubMonths } from './sources/github';
import { getTraktMonths } from './sources/trakt';

export const FEED_CACHE_TAG = 'feed';
export const FEED_PAGE_SIZE = 6;

const MONTH_LABELS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

/** Months where everything is "new" simply because the record had just started. */
const DAWN_MONTHS = 2;

const keyOf = (year: number, month: number) => `${year}-${String(month + 1).padStart(2, '0')}`;

/** Each source is isolated: a missing table or a mock DB must not take out the feed. */
async function safely<T>(load: () => Promise<Map<string, T>>): Promise<Map<string, T>> {
  try {
    return await load();
  } catch {
    return new Map<string, T>();
  }
}

async function computeMonthSummaries(): Promise<MonthSummary[]> {
  let earliest: Date | null = null;
  try {
    const row = (await db.select({ time: listens.time }).from(listens).orderBy(asc(listens.time)).limit(1))[0];
    earliest = row?.time ?? null;
  } catch {
    earliest = null;
  }
  if (!earliest) return [];

  const [music, github, trakt] = await Promise.all([
    safely(getMusicMonths),
    safely(getGithubMonths),
    safely(getTraktMonths),
  ]);

  const now = new Date();
  const currentKey = keyOf(now.getUTCFullYear(), now.getUTCMonth());

  const summaries: MonthSummary[] = [];
  let year = earliest.getUTCFullYear();
  let month = earliest.getUTCMonth();
  let index = 0;

  while (year < now.getUTCFullYear() || (year === now.getUTCFullYear() && month <= now.getUTCMonth())) {
    const key = keyOf(year, month);
    const summary: MonthSummary = {
      key,
      year,
      month,
      label: MONTH_LABELS[month],
      tz: reportTzForDate(new Date(Date.UTC(year, month, 1))),
      isCurrent: key === currentKey,
      isDawn: index < DAWN_MONTHS,
      music: music.get(key),
      github: github.get(key),
      trakt: trakt.get(key),
    };
    // A month with nothing at all in it is left out rather than rendered blank.
    if (summary.music || summary.github || summary.trakt) summaries.push(summary);

    index += 1;
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  // Newest first — the feed reads backwards in time.
  summaries.reverse();
  return summaries;
}

/**
 * The whole timeline, cached. Computing all ~94 months costs about as much as
 * computing one, so pagination is array slicing rather than more queries.
 */
export const getMonthSummaries = unstable_cache(computeMonthSummaries, ['feed-month-summaries'], {
  tags: [FEED_CACHE_TAG],
  revalidate: 60 * 60 * 12,
});

export async function getFeedPage(cursor?: MonthKey | null): Promise<FeedPage> {
  const all = await getMonthSummaries();
  const start = cursor ? all.findIndex((m) => m.key === cursor) + 1 : 0;
  if (cursor && start === 0) return { months: [], nextCursor: null, done: true };

  const months = all.slice(start, start + FEED_PAGE_SIZE);
  const done = start + months.length >= all.length;
  return { months, nextCursor: done ? null : (months[months.length - 1]?.key ?? null), done };
}

export type { MonthSummary };
