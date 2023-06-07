import { LASTFM_BASE_URL } from './urls';

type TopTracksRequest = {
  user?: string;
  period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
  limit?: string;
  page?: string;
};

type TopTracksResponse = {
  toptracks: {
    track: Array<{
      streamable: { fulltrack: string; '#text': string };
      mbid: string;
      name: string;
      image: Array<{ size: 'small' | 'medium' | 'large' | 'extralarge'; '#text': string }>;
      artist: { url: string; name: string; mbid: string };
      url: string;
      duration: string;
      '@attr': { rank: string };
      playcount: string;
    }>;
    '@attr': { user: 'JackMorrison12'; totalPages: string; page: string; perPage: string; total: string };
  };
};

export const getTopTracks = async ({ user = 'jackmorrison12', period, limit, page }: TopTracksRequest) => {
  // TODO update fetch params to be run once every few mins
  const res = await fetch(
    `${LASTFM_BASE_URL}?method=user.gettoptracks&user=${user}&api_key=${process.env.LASTFM_API_KEY}&format=json${
      period ? `&period=${period}` : ''
    }${limit ? `&limit=${limit}` : ''}${page ? `&page=${page}` : ''}`,
  );

  if (!res.ok) {
    console.error(`Failed to fetch top tracks: ${JSON.stringify(res)}`);
    throw new Error('Failed to fetch top tracks');
  }

  console.log(`Fetched top tracks: ${JSON.stringify(res)}`);
  // TODO use Zod/Zodios to auto check this
  return res.json() as Promise<TopTracksResponse>;
};
