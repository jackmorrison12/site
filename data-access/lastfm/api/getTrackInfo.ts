import 'server-only';
import { LASTFM_BASE_URL } from './urls';
import { z } from 'zod';
import _ from 'lodash';

type TrackInfoRequest = {
  username?: string;
} & ({ mbid: string } | { track: string; artist: string });

class LastFMError extends Error {}

const trackInfoSchema = z.object({
  track: z.object({
    name: z.string(),
    url: z.string().url(),
    duration: z.coerce.number(),
    streamable: z.object({ fulltrack: z.string(), '#text': z.string() }),
    listeners: z.coerce.number(),
    playcount: z.coerce.number(),
    artist: z.object({ url: z.string(), name: z.string(), mbid: z.string().optional() }),
    album: z
      .object({
        artist: z.string(),
        title: z.string(),
        url: z.string().url(),
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
      })
      .optional(),
    userplaycount: z.coerce.number(),
    userloved: z.coerce.number().pipe(z.coerce.boolean()),
    toptags: z.object({ tag: z.array(z.object({ name: z.string(), url: z.string().url() })) }),
    wiki: z.object({ published: z.coerce.date(), summary: z.string(), content: z.string() }).optional(),
  }),
});

export const getTrackInfo = async (req: TrackInfoRequest) => {
  const url = `${LASTFM_BASE_URL}?method=track.getinfo
    &username=${req.username ?? 'Jackmorrison12'}
&autocorrect=1
&api_key=${process.env.LASTFM_API_KEY}
&format=json
${'mbid' in req ? `&mbid=${req.mbid}` : ''}
${'track' in req ? `&track=${req.track}` : ''}
${'artist' in req ? `&artist=${req.artist}` : ''}`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 } });

  if (!res.ok) {
    console.error(`Failed to fetch track info for ${JSON.stringify(req)}: ${JSON.stringify(res)}`);
    throw new Error(`Failed to fetch track info for ${JSON.stringify(req)}`);
  }

  const parsedResult = trackInfoSchema.safeParse(await res.json());

  if (!parsedResult.success) {
    console.error(`Failed to parse lastfm track info API response: ${JSON.stringify(parsedResult.error.issues)}`);
    throw new LastFMError();
  }

  console.log(`Fetched track info from LastFM API for ${JSON.stringify(req)}`);
  return parsedResult.data;
};
