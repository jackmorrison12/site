import 'server-only';
import { LASTFM_BASE_URL } from './urls';
import { z } from 'zod';

type TopTracksRequest = {
  user?: string;
  period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
  limit?: string;
  page?: string;
};

class LastFMError extends Error {}

const topTracksSchema = z.object({
  toptracks: z.object({
    track: z.array(
      z.object({
        streamable: z.object({ fulltrack: z.string(), '#text': z.string() }),
        mbid: z.string(),
        name: z.string(),
        image: z.array(z.object({ size: z.enum(['small', 'medium', 'large', 'extralarge']), '#text': z.string() })),
        artist: z.object({ url: z.string(), name: z.string(), mbid: z.string() }),
        url: z.string(),
        duration: z.coerce.number(),
        '@attr': z.object({ rank: z.string() }),
        playcount: z.string(),
      }),
    ),
    '@attr': z.object({
      user: z.literal('Jackmorrison12'),
      totalPages: z.string(),
      page: z.string(),
      perPage: z.string(),
      total: z.string(),
    }),
  }),
});

export const getTopTracks = async ({ user = 'jackmorrison12', period, limit, page }: TopTracksRequest) => {
  // TODO update fetch params to be run once every few mins
  const url = `${LASTFM_BASE_URL}?method=user.gettoptracks&user=${user}&api_key=${
    process.env.LASTFM_API_KEY
  }&format=json${period ? `&period=${period}` : ''}${limit ? `&limit=${limit}` : ''}${page ? `&page=${page}` : ''}`;

  const res = await fetch(url, { next: { revalidate: 60 * 3 } });

  if (!res.ok) {
    console.error(`Failed to fetch top tracks: ${JSON.stringify(res)}`);
    throw new Error('Failed to fetch top tracks');
  }

  const parsedResult = topTracksSchema.safeParse(await res.json());

  if (!parsedResult.success) {
    console.error(`Failed to parse lastfm API response: ${parsedResult.error.issues}`);
    throw new LastFMError();
  }

  console.log(`Fetched top tracks from LastFM API`);
  return parsedResult.data;
};
