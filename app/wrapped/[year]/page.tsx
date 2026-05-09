import { notFound } from 'next/navigation';
import { Title } from 'components/shared/Title';
import {
  getSummaryStats,
  getTopTracks,
  getTopArtists,
  getTopArtistByMonth,
  getObsessionTracks,
  getListeningPatterns,
  getNewDiscoveries,
  getArtistTrends,
  getLastSyncTime,
  yearRange,
  reportTz,
} from '../data';
import { TzNote } from '../components/TzNote';
import { SummaryCards } from '../components/SummaryCards';
import { TopTracks } from '../components/TopTracks';
import { TopArtists } from '../components/TopArtists';
import { MonthlyLeaderboard } from '../components/MonthlyLeaderboard';
import { ObsessionTracks } from '../components/ObsessionTracks';
import { ListeningPatterns } from '../components/ListeningPatterns';
import { NewDiscoveries } from '../components/NewDiscoveries';
import { ArtistTrends } from '../components/ArtistTrends';
import { RefreshButton } from 'app/feed/lastfm/RefreshButton';
import { LocalTime } from '../components/LocalTime';
import styles from '../wrapped.module.scss';

export default async function Page(props: { params: Promise<{ year: string }> }) {
  const params = await props.params;
  const year = parseInt(params.year, 10);

  if (isNaN(year) || year < 2000 || year > 2100 || params.year.length !== 4) {
    notFound();
  }

  const range = yearRange(year);
  const tz = reportTz(year);

  const [summary, topTracks, topArtists, monthlyTop, obsessions, patterns, discoveries, trends, lastSync] =
    await Promise.all([
      getSummaryStats(range),
      getTopTracks(range),
      getTopArtists(range),
      getTopArtistByMonth(range, tz),
      getObsessionTracks(range, tz),
      getListeningPatterns(range, tz),
      getNewDiscoveries(range),
      getArtistTrends(range),
      getLastSyncTime(),
    ]);

  if (summary.totalListens === 0) {
    return (
      <>
        <Title value="WRAPPED" offset="-311.71" />
        <p className={styles.empty}>No listens recorded for {year}.</p>
      </>
    );
  }

  return (
    <>
      <Title value="WRAPPED" offset="-311.71" />
      <div className={styles.layout}>
        <div className={styles.summary}>
          <SummaryCards stats={summary} year={year} />
        </div>
        <div className={styles.tracks}>
          <TopTracks tracks={topTracks} />
        </div>
        <div className={styles.artists}>
          <TopArtists artists={topArtists} />
        </div>
        <div className={styles.monthly}>
          <MonthlyLeaderboard months={monthlyTop} />
        </div>
        <div className={styles.obsession}>
          <ObsessionTracks obsessions={obsessions} />
        </div>
        <div className={styles.patterns}>
          <ListeningPatterns patterns={patterns} />
        </div>
        <div className={styles.discover}>
          <NewDiscoveries artists={discoveries} />
        </div>
        <div className={styles.trends}>
          <ArtistTrends trends={trends} />
        </div>
        <div className={styles.syncNote}>
          {lastSync && (
            <p>
              Last listen synced <LocalTime date={lastSync} />
            </p>
          )}
          <RefreshButton />
        </div>
        <div className={styles.tzNoteFooter}>
          <TzNote tz={tz} year={year} />
        </div>
      </div>
    </>
  );
}

export async function generateMetadata(props: { params: Promise<{ year: string }> }) {
  const params = await props.params;
  return {
    title: `Wrapped ${params.year}`,
    description: `My music listening wrapped for ${params.year}`,
  };
}
