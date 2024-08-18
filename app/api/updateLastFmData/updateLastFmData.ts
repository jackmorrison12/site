'use server';

import { getRecentTracks } from 'data-access/lastfm/api/getRecentTracks';
import { desc } from 'drizzle-orm';
import { db } from 'drizzle/db';
import { listens, tracks } from 'drizzle/schema';
import { revalidatePath } from 'next/cache';

export const updateLastFmData = async () => {
  const lastListen = (await db.select({ time: listens.time }).from(listens).orderBy(desc(listens.time)).limit(1))[0]
    .time;

  const { totalPages, total } = (await getRecentTracks({ page: 1, from: lastListen })).recenttracks['@attr'];

  let pageNumber = 1;

  while (pageNumber <= totalPages) {
    console.log('Syncing page %d of %d', pageNumber, totalPages);
    const recentTrackResult = await getRecentTracks({ page: pageNumber });

    const trackInfos = recentTrackResult.recenttracks.track
      .map((track) => ({
        id: track.name.replaceAll(' ', '_') + '__' + track.artist.name.replaceAll(' ', '_'),
        mbid: track.mbid !== '' ? track.mbid : undefined,
        name: track.name,
        artist: track.artist.name,
        time: track.date,
        imageUrl: track.image.extralarge,
        album: track.album['#text'],
      }))
      .filter((ti): ti is typeof ti & { time: Date } => ti.time !== undefined);

    await db.insert(tracks).values(trackInfos).onConflictDoNothing();

    await db.insert(listens).values(trackInfos).onConflictDoNothing();

    pageNumber += 1;

    await new Promise((r) => setTimeout(r, 100));
  }

  revalidatePath('/feed/lastfm');

  return { total, totalPages };
};
