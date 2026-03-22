import type { ArtistWithCount } from '../data.types';
import { RankedList } from './RankedList';

export function TopArtists({ artists }: { artists: ArtistWithCount[] }) {
  return (
    <RankedList
      heading="Top Artists"
      barColor="secondary"
      items={artists.map((a) => ({
        key: a.artist,
        imageUrl: a.imageUrl ?? null,
        imageAlt: a.artist,
        title: a.artist,
        subtitle: a.topTrack ? `Top Track: ${a.topTrack}` : undefined,
        count: a.count,
      }))}
    />
  );
}
