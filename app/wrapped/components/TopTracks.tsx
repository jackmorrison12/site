import type { TrackWithCount } from '../data.types';
import { RankedList } from './RankedList';

export function TopTracks({ tracks }: { tracks: TrackWithCount[] }) {
  return (
    <RankedList
      heading="Top Tracks"
      items={tracks.map((t) => ({
        key: t.id,
        imageUrl: t.imageUrl,
        imageAlt: t.name,
        title: t.name,
        subtitle: t.artist,
        count: t.count,
      }))}
    />
  );
}
