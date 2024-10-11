import 'server-only';
import { LASTFM_BASE_URL } from './urls';
import { z } from 'zod';
import _ from 'lodash';

type RecentTracksRequest = {
  user?: string;
  limit?: number;
  page?: number;
  from?: Date;
  to?: Date;
};

class LastFMError extends Error {}

const Track = z.object({
  streamable: z.coerce.number().pipe(z.coerce.boolean()),
  mbid: z.string(),
  name: z.string(),
  image: z
    .array(z.object({ size: z.enum(['small', 'medium', 'large', 'extralarge']), '#text': z.string() }))
    .transform((imgArray) => {
      return _.transform(
        imgArray,
        (result, value) => {
          result[value.size] = value['#text'];
        },
        {} as Record<'small' | 'medium' | 'large' | 'extralarge', string>,
      );
    }),
  artist: z.object({
    url: z.string().url(),
    name: z.string(),
    mbid: z.string(),
    image: z
      .array(z.object({ size: z.enum(['small', 'medium', 'large', 'extralarge']), '#text': z.string() }))
      .transform((imgArray) => {
        return _.transform(
          imgArray,
          (result, value) => {
            result[value.size] = value['#text'];
          },
          {} as Record<'small' | 'medium' | 'large' | 'extralarge', string>,
        );
      }),
  }),
  date: z
    .object({ uts: z.coerce.number(), '#text': z.string() })
    .optional()
    .transform((date) => (date ? new Date(date.uts * 1000) : undefined)),
  url: z.string().url(),
  '@attr': z.object({ nowplaying: z.coerce.boolean() }).optional(),
  album: z.object({ mbid: z.string(), '#text': z.string() }),
  loved: z.coerce.number().pipe(z.coerce.boolean()),
});

const recentTracksSchema = Track.or(
  z.object({
    recenttracks: z.object({
      track: Track.or(z.array(Track)),
      '@attr': z.object({
        user: z.string(),
        totalPages: z.coerce.number(),
        page: z.coerce.number(),
        perPage: z.coerce.number(),
        total: z.coerce.number(),
      }),
    }),
  }),
).transform((result) =>
  'recenttracks' in result
    ? result
    : { recenttracks: { track: [result], '@attr': { user: '', totalPages: 1, page: 1, perPage: 1, total: 1 } } },
);

export const getRecentTracks = async ({ user = 'jackmorrison12', limit, page, from, to }: RecentTracksRequest) => {
  const url = `${LASTFM_BASE_URL}?method=user.getrecenttracks
    &user=${user}
    &api_key=${process.env.LASTFM_API_KEY}
    &format=json
    &extended=1
    ${limit ? `&limit=${limit}` : ''}
    ${page ? `&page=${page}` : ''}
    ${from ? `&from=${Math.floor(from.getTime() / 1000)}` : ''}
    ${to ? `&to=${to.toISOString()}` : ''}`;

  const res = await fetch(url, { next: { revalidate: 60 * 3 } });

  if (!res.ok) {
    console.error(`Failed to fetch recent tracks: ${JSON.stringify(res)}`);
    throw new Error('Failed to fetch recent tracks');
  }

  const parsedResult = recentTracksSchema.safeParse(res.json());

  if (!parsedResult.success) {
    console.error(`Failed to parse lastfm recent tracks API response: ${JSON.stringify(parsedResult.error.issues)}`);
    throw new LastFMError();
  }

  console.log(`Fetched recent tracks from LastFM API`);
  return parsedResult.data;
};
