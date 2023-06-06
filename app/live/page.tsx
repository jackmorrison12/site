import { Title } from '../../components/shared/Title';

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

async function getTopTracks({
  user = 'jackmorrison12',
  period,
  limit,
  page,
}: {
  user?: string;
  period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
  limit?: string;
  page?: string;
}) {
  // TODO update fetch params to be run once every few mins
  const res = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&api_key=${
      process.env.LASTFM_API_KEY
    }&format=json${period ? `&period=${period}` : ''}${limit ? `&limit=${limit}` : ''}${page ? `&page=${page}` : ''}`,
  );

  if (!res.ok) {
    console.error(`Failed to fetch top tracks: ${JSON.stringify(res)}`);
    throw new Error('Failed to fetch top tracks');
  }

  console.log(`Fetched top tracks: ${JSON.stringify(res)}`);
  // TODO use Zod/Zodios to auto check this
  return res.json() as Promise<TopTracksResponse>;
}

export default async function Page() {
  const data = await getTopTracks({ limit: '3' });
  console.log(`Top tracks retrieved: ${JSON.stringify(data)}`);
  return (
    <>
      <Title value="LIVE" offset="-313.32" />
      <p>Live data on what I&apos;m up to!</p>
      <ul>
        {data.toptracks.track.map((t) => (
          <li key={t.mbid}>
            <a href={t.url}>
              {t.playcount} - {t.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export const metadata = {
  title: 'Live',
  description: 'Live information',
};
