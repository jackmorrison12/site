import { formatInTimeZone } from 'date-fns-tz';

import { Title } from '../../components/shared/Title';
import { getRecentTracks } from '../../data-access/lastfm/api/getRecentTracks';
import { getTopTracks } from '../../data-access/lastfm/api/getTopTracks';
import { useLivePage } from './live.hooks';

export default async function Page() {
  const topTracks = await getTopTracks({ limit: 10 });
  const recentTracks = await getRecentTracks({});

  const { events } = await useLivePage();

  return (
    <>
      <Title value="LIVE" offset="-313.32" />

      <div
        style={{
          width: '320px',
          height: '400px',
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '20px',
          padding: '20px',
          // overflow: 'scroll',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <h3>
          Recent GitHub Activity{' '}
          <span style={{ fontSize: 'var(--fontSizes_tiny)' }}>
            (in {formatInTimeZone(new Date(), 'Europe/London', 'z') === 'GMT' ? 'GMT' : 'BST'})
          </span>
        </h3>
        <div style={{ overflow: 'scroll', flex: '1' }}>
          {Object.entries(events).map(([date, evts]) => (
            <div key={date} style={{ paddingBottom: '10px' }}>
              <p
                style={{
                  fontSize: 'var(--fontSizes_tiny)',
                  fontWeight: 'var(--fontWeights_thick)',
                  textTransform: 'uppercase',
                }}
              >
                {date}
              </p>
              {evts.map(
                (e) =>
                  e.message && (
                    <div
                      key={e.id}
                      style={{ display: 'flex', flexDirection: 'row', gap: '10px', paddingBottom: '5px' }}
                    >
                      <p
                        style={{
                          fontSize: 'var(--fontSizes_tiny)',
                          fontWeight: 'var(--fontWeights_thick)',
                          paddingLeft: '10px',
                          flex: 'none',
                        }}
                      >
                        {e.created_at ? `${formatInTimeZone(new Date(e.created_at), 'Europe/London', 'h:mm aa')} ` : ''}
                      </p>
                      <p style={{ fontSize: 'var(--fontSizes_small)' }}>{e.message}</p>
                    </div>
                  ),
              )}
            </div>
          ))}
        </div>
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
