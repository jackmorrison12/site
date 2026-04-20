'use server';

import { getRecentTracks } from 'data-access/lastfm/api/getRecentTracks';
import { desc, sql } from 'drizzle-orm';
import { db } from 'drizzle/db';
import { listens, tracks } from 'drizzle/schema';
import _ from 'lodash';
import { revalidatePath } from 'next/cache';

const DAY = 1000 * 60 * 60 * 24;
const DEFAULT_FROM = new Date('2024-01-01');

export const updateLastFmData = async ({ days }: { days?: number }) => {
  const lastListenRow = (
    await db.select({ time: listens.time }).from(listens).orderBy(desc(listens.time)).limit(1)
  )[0];

  const lastListen = lastListenRow?.time ?? DEFAULT_FROM;

  const fromTime = days ? lastListen.getTime() - days * DAY : lastListen.getTime() + 1000;
  const from = new Date(fromTime);

  const { totalPages, total } = (await getRecentTracks({ page: 1, from })).recenttracks['@attr'];

  let pageNumber = 1;

  while (pageNumber <= totalPages) {
    console.log('Syncing page %d of %d', pageNumber, totalPages);

    try {
      const recentTrackResult = await getRecentTracks({ page: pageNumber, from });

      const trackInfos = _.castArray(recentTrackResult.recenttracks.track)
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

      const uniqueTracks = _.uniqBy(trackInfos, 'id');

      await db
        .insert(tracks)
        .values(uniqueTracks)
        .onConflictDoUpdate({
          target: tracks.id,
          set: {
            mbid: sql`excluded.backup_id`,
            name: sql`excluded.name`,
            artist: sql`excluded.artist`,
            album: sql`excluded.album`,
            imageUrl: sql`excluded.image_url`,
          },
        });

      await db.insert(listens).values(trackInfos).onConflictDoNothing();
    } catch (error) {
      console.error('Failed to sync page %d: %s', pageNumber, error);
    }

    pageNumber += 1;

    await new Promise((r) => setTimeout(r, 100));
  }

  revalidatePath('/feed/lastfm');

  return { total, totalPages };
};
