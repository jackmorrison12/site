import 'server-only';
import { LASTFM_BASE_URL } from './urls';
import { z } from 'zod';
import _ from 'lodash';

type AlbumInfoRequest = {
  username?: string;
} & ({ mbid: string } | { album: string; artist: string });

class LastFMError extends Error {}

const albumInfoSchema = z.object({
  album: z.object({
    artist: z.string(),
    mbid: z.string(),
    tags: z.string(),
    name: z.string(),
    image: z
      .array(z.object({ size: z.enum(['small', 'medium', 'large', 'extralarge', 'mega', '']), '#text': z.string() }))
      .transform((imgArray) => {
        return _.transform(
          imgArray,
          (result, value) => {
            result[value.size] = value['#text'];
          },
          {} as Record<'small' | 'medium' | 'large' | 'extralarge' | 'mega' | '', string>,
        );
      }),
    tracks: z
      .object({
        track: z.object({
          streamable: z.object({ fulltrack: z.coerce.number().pipe(z.coerce.boolean()), '#text': z.string() }),
          duration: z.number(),
          url: z.string(),
          name: z.string(),
          '@attr': z.object({ rank: z.number() }),
          artist: z.object({ url: z.string(), name: z.string(), mbid: z.string() }),
        }),
      })
      .optional(),
    listeners: z.coerce.number(),
    playcount: z.coerce.number(),
    url: z.string().url(),
    userplaycount: z.number(),
  }),
});

export const getAlbumInfo = async (req: AlbumInfoRequest) => {
  const url = `${LASTFM_BASE_URL}?method=album.getinfo
    &username=${req.username ?? 'Jackmorrison12'}
&autocorrect=1
&api_key=${process.env.LASTFM_API_KEY}
&format=json
${'mbid' in req ? `&mbid=${req.mbid}` : ''}
${'album' in req ? `&album=${req.album}` : ''}
${'artist' in req ? `&artist=${req.artist}` : ''}`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 } });

  if (!res.ok) {
    console.error(`Failed to fetch album info for ${JSON.stringify(req)}: ${JSON.stringify(res)}`);
    throw new Error(`Failed to fetch album info for ${JSON.stringify(req)}`);
  }

  const parsedResult = albumInfoSchema.safeParse(await res.json());

  if (!parsedResult.success) {
    console.error(`Failed to parse lastfm album info API response: ${JSON.stringify(parsedResult.error.issues)}`);
    throw new LastFMError();
  }

  console.log(`Fetched album info from LastFM API for ${JSON.stringify(req)}`);
  return parsedResult.data;
};
