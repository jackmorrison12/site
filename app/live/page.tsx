import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';

import { Title } from '../../components/shared/Title';
import { getRecentTracks } from '../../data-access/lastfm/api/getRecentTracks';
import { getTopTracks } from '../../data-access/lastfm/api/getTopTracks';
import { useLivePage } from './live.hooks';
import { getEvents } from '../../data-access/github/api/getEvents';
import _ from 'lodash';
import { Heatmap } from './Heatmap';
import { GitHubIcon } from '../me/logos/github';

export default async function Page() {
  const topTracks = await getTopTracks({ limit: 10 });
  const recentTracks = await getRecentTracks({});

  const { events } = await useLivePage();

  const NUM_WEEKS = 9;
  const ONE_WEEK = 60 * 60 * 1000 * 24 * 7;

  // Zero indexed day of week
  const dayOfWeek = Number(formatInTimeZone(new Date(), 'Europe/London', 'i')) - 1;
  const currentDate = new Date(utcToZonedTime(new Date(), 'Europe/London').toDateString());
  currentDate.setDate(currentDate.getDate() - dayOfWeek);

  // Get the current monday 7 format it

  // dd/mm for the last NUM_WEEKS mondays
  const xLabels = new Array(NUM_WEEKS)
    .fill(0)
    .map((_, i) => formatInTimeZone(new Date(currentDate.getTime() - ONE_WEEK * i), 'Europe/London', 'dd/LL'))
    .reverse();

  const yLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const evts = await getEvents({ perPage: 100 });

  const currentDay = new Date(utcToZonedTime(new Date(), 'Europe/London').toDateString()).valueOf();

  const groupedEvents = _.groupBy(evts, (e) => {
    if (!e.created_at) {
      return '';
    }
    const eventDay = new Date(utcToZonedTime(e.created_at, 'Europe/London').toDateString()).valueOf();

    const diffTime = Math.abs(currentDay.valueOf() - eventDay.valueOf());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  });

  const daysShown = (NUM_WEEKS - 1) * 7 + dayOfWeek + 1;

  const data1d = new Array(daysShown).fill(0);

  Object.entries(groupedEvents).forEach(([k, v]) => {
    if (Number(k) < daysShown) {
      data1d[daysShown - Number(k) - 1] = v.length;
    }
  });

  const data2d = _.compact(
    data1d.map(function (el, i) {
      if (i % 7 === 0) {
        return data1d.slice(i, i + 7);
      }
    }),
  );
  const data = data2d[0].map((_, colIndex) => data2d.map((row) => row[colIndex] ?? 0));

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
