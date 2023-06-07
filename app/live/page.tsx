import { Title } from '../../components/shared/Title';
import { getTopTracks } from '../../data-access/lastfm/api/getTopTracks';

export default async function Page() {
  const data = await getTopTracks({ limit: '10' });
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
