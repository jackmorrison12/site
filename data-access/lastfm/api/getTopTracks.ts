import 'server-only';
import { LASTFM_BASE_URL } from './urls';
import { z } from 'zod';
import _ from 'lodash';

type TopTracksRequest = {
  user?: string;
  period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
  limit?: number;
  page?: number;
};

class LastFMError extends Error {}

const topTracksSchema = z.object({
  toptracks: z.object({
    track: z.array(
      z.object({
        streamable: z.object({ fulltrack: z.string(), '#text': z.string() }),
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
        artist: z.object({ url: z.string().url(), name: z.string(), mbid: z.string() }),
        url: z.string().url(),
        duration: z.coerce.number(),
        '@attr': z.object({ rank: z.coerce.number() }),
        playcount: z.coerce.number(),
      }),
    ),
    '@attr': z.object({
      user: z.string(),
      totalPages: z.coerce.number(),
      page: z.coerce.number(),
      perPage: z.coerce.number(),
      total: z.coerce.number(),
    }),
  }),
});

export const getTopTracks = async ({ user = 'jackmorrison12', period, limit, page }: TopTracksRequest) => {
  const url = `${LASTFM_BASE_URL}?method=user.gettoptracks
    &user=${user}
    &api_key=${process.env.LASTFM_API_KEY}
    &format=json
    ${period ? `&period=${period}` : ''}
    ${limit ? `&limit=${limit}` : ''}
    ${page ? `&page=${page}` : ''}`;

  const res = await fetch(url, { next: { revalidate: 60 * 3 } });

  if (!res.ok) {
    console.error(`Failed to fetch top tracks: ${JSON.stringify(res)}`);
    throw new Error('Failed to fetch top tracks');
  }

  const parsedResult = topTracksSchema.safeParse(await res.json());

  if (!parsedResult.success) {
    console.error(`Failed to parse lastfm top tracks API response: ${JSON.stringify(parsedResult.error.issues)}`);
    throw new LastFMError();
  }

  console.log(`Fetched top tracks from LastFM API`);
  return parsedResult.data;
};
