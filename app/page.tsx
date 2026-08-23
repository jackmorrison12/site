import { ContributionGraph } from './ContributionGraph';
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
    />
  );
}
