import { Title } from '../../components/shared/Title';
import { getRecentTracks } from '../../data-access/lastfm/api/getRecentTracks';
import { getTopTracks } from '../../data-access/lastfm/api/getTopTracks';

export default async function Page() {
  const topTracks = await getTopTracks({ limit: 10 });
  const recentTracks = await getRecentTracks({});
  return (
    <>
      <Title value="LIVE" offset="-313.32" />
      <p>Recent tracks</p>
      <ul>
        {recentTracks.recenttracks.track.map((t) => (
          <li key={`${t.name} ${t.artist.name}`}>
            <a href={t.url}>
              {t.date?.toString() || 'Now Playing'} - {t.name}
            </a>
          </li>
        ))}
      </ul>
      <p>Top tracks</p>
      <ul>
        {topTracks.toptracks.track.map((t) => (
          <li key={`${t.name} ${t.artist.name}`}>
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
