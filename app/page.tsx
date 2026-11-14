import { Suspense } from 'react';
import { ContributionGraph } from './ContributionGraph';
import { Timeline, TimelineSkeleton } from './Timeline/Timeline';
import { HomeLayout } from './HomeLayout';
import { MusicStats } from './MusicStats';
import { TopTrack } from './TopTrack';

export default function Page() {
  return (
    <HomeLayout
      topTrackSlot={<TopTrack />}
      musicStatsSlot={<MusicStats />}
      contributionsSlot={<ContributionGraph />}
      contributionsCardSlot={<ContributionGraph variant="card" />}
      feedSlot={
        <Suspense fallback={<TimelineSkeleton />}>
          <Timeline />
        </Suspense>
      }
    />
  );
}
