import { HomeLayout } from './HomeLayout';
import { TopTrack } from './TopTrack';

export default function Page() {
  return <HomeLayout topTrackSlot={<TopTrack />} />;
}
