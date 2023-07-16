import { Title } from '../../components/shared/Title';
import { getRecentTracks } from '../../data-access/lastfm/api/getRecentTracks';
import { getTopTracks } from '../../data-access/lastfm/api/getTopTracks';
import _ from 'lodash';
import { Heatmap } from './Heatmap';
import { GitHubIcon } from '../me/logos/github';
import { useHeatmap } from './Heatmap.hooks';

export default async function Page() {
  const topTracks = await getTopTracks({ limit: 10 });
  const recentTracks = await getRecentTracks({});

  const { data, xLabels, yLabels } = await useHeatmap();

  return (
    <>
      <Title value="LIVE" offset="-313.32" />
      <div
        style={{
          backgroundColor: 'var(--colours_secondary_default)',
          width: 'fit-content',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', paddingBottom: '10px' }}
        >
          <div style={{ width: '30px' }}>
            <GitHubIcon />
          </div>
          <h3>Recent Activity</h3>
        </div>
        <Heatmap data={data} xLabels={xLabels} yLabels={yLabels} />
      </div>
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
