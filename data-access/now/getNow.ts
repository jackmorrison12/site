import 'server-only';

import { unstable_cache } from 'next/cache';
import { FEED_CACHE_TAG } from 'data-access/feed/getMonthSummaries';
import type { NowData } from './now.types';
import { getListening } from './listening';
import { getTravel } from './travel';
import { getWatching } from './watching';

/** Each section is isolated: a missing table or the mock DB must not take out the page. */
async function safely<T>(load: () => Promise<T | null>): Promise<T | null> {
  try {
    return await load();
  } catch (e) {
    console.error('now page section failed', e);
    return null;
  }
}

async function computeNow(): Promise<NowData> {
  const [listening, watching, travel] = await Promise.all([
    safely(getListening),
    safely(getWatching),
    safely(getTravel),
  ]);
  return { listening, watching, travel };
}

/** Cached with the homepage feed: same 12 hour refresh, and purging the feed tag clears it too. */
export const getNow = unstable_cache(computeNow, ['now-page'], {
  tags: [FEED_CACHE_TAG],
  revalidate: 60 * 60 * 12,
});
